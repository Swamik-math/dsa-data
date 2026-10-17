"""
Advanced Real‑Time Hand Gesture Recognition
------------------------------------------

Features
- Real‑time hand tracking via MediaPipe
- Robust feature extraction (normalized 3D landmarks + angles)
- Static gesture classification using KNN over your recorded samples
- Dynamic (temporal) gesture spotting with DTW over angle sequences
- Lag reduction with exponential smoothing + majority voting
- One file, no training step required (collect samples interactively)

Dependencies
pip install opencv-python mediapipe numpy

Optional (for nicer JSON pretty‑print only):
pip install orjson

Usage
1) Collect static gesture samples (press and hold the key shown to label frames):
   python advanced_hand_gestures.py --collect static --label THUMBS_UP

2) Collect dynamic gesture samples (record sequences start/stop):
   python advanced_hand_gestures.py --collect dynamic --label WAVE
   (Press "r" to start/stop a recording; press "q" to save and quit.)

3) Run recognition:
   python advanced_hand_gestures.py --run

4) Clear dataset:
   python advanced_hand_gestures.py --reset

Notes
- Press "q" in any mode to quit.
- Data is saved to gestures_data.json in the same directory.

"""
from __future__ import annotations
import argparse
import json
import math
import os
import time
from dataclasses import dataclass, field
from typing import Deque, Dict, List, Literal, Optional, Tuple
from collections import deque, Counter

import cv2
import numpy as np

try:
    import mediapipe as mp
except Exception as e:
    raise SystemExit("mediapipe is required. Install with `pip install mediapipe`.\n" + str(e))

# ------------------------------
# Utility: JSON persistence
# ------------------------------
DATA_FILE = "gestures_data.json"

def load_data() -> Dict:
    if not os.path.exists(DATA_FILE):
        return {"static": {}, "dynamic": {}}
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return {"static": {}, "dynamic": {}}

def save_data(data: Dict) -> None:
    tmp = DATA_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    os.replace(tmp, DATA_FILE)

# ------------------------------
# Geometry helpers
# ------------------------------

# MediaPipe hand landmark indices
WRIST = 0
FINGER_TIPS = [4, 8, 12, 16, 20]
MCP = [5, 9, 13, 17]
PIP = [6, 10, 14, 18]
DIP = [7, 11, 15, 19]

@dataclass
class HandFeatures:
    vec: np.ndarray  # (D,) flattened normalized features (landmarks + angles)
    angles: np.ndarray  # (A,) just the angle features (for DTW)


def unit_vector(v: np.ndarray, eps: float = 1e-9) -> np.ndarray:
    n = np.linalg.norm(v) + eps
    return v / n


def angle_between(v1: np.ndarray, v2: np.ndarray) -> float:
    v1_u = unit_vector(v1)
    v2_u = unit_vector(v2)
    dot = np.clip(np.dot(v1_u, v2_u), -1.0, 1.0)
    return float(math.degrees(math.acos(dot)))


def extract_features(landmarks: np.ndarray) -> HandFeatures:
    """
    landmarks: (21,3) in image coords [0..1].
    Steps:
    - translate to wrist origin
    - scale by hand size (max dist from wrist)
    - flatten normalized coords -> 63 dims
    - add finger joint angles (20 angles)
    """
    lm = landmarks.copy()  # (21,3)
    wrist = lm[WRIST]
    lm[:, :3] = lm[:, :3] - wrist
    scale = np.max(np.linalg.norm(lm[:, :3], axis=1)) + 1e-6
    lm[:, :3] = lm[:, :3] / scale

    # Landmark vector
    lm_vec = lm.flatten()  # 63 dims

    # Angles for each finger: MCP-PIP-DIP-TIP gives 3 interior angles per finger (MCP, PIP, DIP)
    angles: List[float] = []
    for mcp, pip, dip, tip in zip(MCP, PIP, DIP, FINGER_TIPS[1:]):  # skip thumb for this loop
        v1 = lm[mcp] - lm[pip]
        v2 = lm[dip] - lm[pip]
        ang_pip = angle_between(v1, v2)
        v1 = lm[pip] - lm[dip]
        v2 = lm[tip] - lm[dip]
        ang_dip = angle_between(v1, v2)
        # Finger splay: angle between MCP direction and wrist-to-MCP plane
        v1 = lm[mcp] - lm[WRIST]
        if mcp != MCP[0]:
            v2 = lm[mcp] - lm[MCP[0]]
        else:
            v2 = lm[MCP[1]] - lm[mcp]
        ang_mcp = angle_between(v1, v2)
        angles.extend([ang_mcp, ang_pip, ang_dip])

    # Thumb angles (approx): CMC-MCP-IP-TIP (MediaPipe lacks CMC; use wrist->1 as proxy)
    # Indices: 1,2,3,4
    v1 = lm[2] - lm[1]
    v2 = lm[4] - lm[3]
    ang_thumb_open = angle_between(v1, v2)
    v1 = lm[WRIST] - lm[1]
    v2 = lm[2] - lm[1]
    ang_thumb_base = angle_between(v1, v2)
    angles.extend([ang_thumb_open, ang_thumb_base])

    angles_np = np.asarray(angles, dtype=np.float32)

    # Final feature vector: normalized lm + normalized angles
    ang_norm = (angles_np - 90.0) / 90.0  # roughly center near 0
    feat = np.concatenate([lm_vec, ang_norm])
    return HandFeatures(vec=feat.astype(np.float32), angles=angles_np.astype(np.float32))

# ------------------------------
# KNN static classifier
# ------------------------------

def knn_classify(sample: np.ndarray, db: Dict[str, List[List[float]]], k: int = 7,
                  thresh: float = 2.5) -> Tuple[str, float]:
    """Return (label, confidence[0..1]). Uses Euclidean distance in feature space.
    thresh is a soft cutoff on average distance of neighbors.
    """
    if not db:
        return ("", 0.0)
    pts = []
    labels = []
    for lab, arr in db.items():
        for feat in arr:
            pts.append(feat)
            labels.append(lab)
    X = np.asarray(pts, dtype=np.float32)
    dists = np.linalg.norm(X - sample[None, :], axis=1)
    if len(dists) == 0:
        return ("", 0.0)
    idx = np.argsort(dists)[:max(1, min(k, len(dists)))]
    top_labels = [labels[i] for i in idx]
    avg_dist = float(np.mean(dists[idx]))
    vote = Counter(top_labels).most_common(1)[0]
    conf = max(0.0, 1.0 - (avg_dist / thresh))
    if avg_dist > thresh:
        return ("", max(0.05, conf * 0.5))
    return (vote[0], conf)

# ------------------------------
# DTW for dynamic gestures
# ------------------------------

def dtw_distance(seq1: np.ndarray, seq2: np.ndarray) -> float:
    """Classic DTW with Euclidean cost over per-frame angle vectors."""
    n, m = len(seq1), len(seq2)
    if n == 0 or m == 0:
        return float("inf")
    dp = np.full((n + 1, m + 1), np.inf, dtype=np.float32)
    dp[0, 0] = 0.0
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = np.linalg.norm(seq1[i - 1] - seq2[j - 1])
            dp[i, j] = cost + min(dp[i - 1, j], dp[i, j - 1], dp[i - 1, j - 1])
    return float(dp[n, m] / (n + m))  # length‑normalized

# ------------------------------
# Smoothing helpers
# ------------------------------
class EMA:
    def __init__(self, alpha: float, dim: int):
        self.alpha = alpha
        self.state = np.zeros((dim,), dtype=np.float32)
        self.initialized = False

    def update(self, x: np.ndarray) -> np.ndarray:
        if not self.initialized:
            self.state = x.copy()
            self.initialized = True
        else:
            self.state = self.alpha * x + (1 - self.alpha) * self.state
        return self.state

# ------------------------------
# Visual helpers
# ------------------------------
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_styles = mp.solutions.drawing_styles

@dataclass
class RecognizerConfig:
    static_vote_window: int = 10
    ema_alpha: float = 0.5
    dynamic_buffer: int = 60  # frames kept for DTW
    dynamic_thresh: float = 0.55

@dataclass
class RecognizerState:
    votes: Deque[str] = field(default_factory=lambda: deque(maxlen=10))
    angles_buffer: Deque[np.ndarray] = field(default_factory=lambda: deque(maxlen=60))
    fps_hist: Deque[float] = field(default_factory=lambda: deque(maxlen=30))

# ------------------------------
# Main app
# ------------------------------

def draw_label(img, text: str, org=(10, 30)):
    cv2.putText(img, text, org, cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 3, cv2.LINE_AA)
    cv2.putText(img, text, org, cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 1, cv2.LINE_AA)


def collect_static(label: str):
    data = load_data()
    data.setdefault("static", {}).setdefault(label, [])

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise SystemExit("Could not open webcam")

    ema = EMA(alpha=0.6, dim=63 + 14)  # feature length used in extract_features
    last_time = time.time()

    with mp_hands.Hands(model_complexity=1, max_num_hands=1, min_detection_confidence=0.6, min_tracking_confidence=0.6) as hands:
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            res = hands.process(rgb)

            if res.multi_hand_landmarks:
                hand_lm = res.multi_hand_landmarks[0]
                pts = np.array([[lm.x, lm.y, lm.z] for lm in hand_lm.landmark], dtype=np.float32)
                feats = extract_features(pts)
                sm = ema.update(feats.vec)
                data["static"][label].append(sm.tolist())
                mp_drawing.draw_landmarks(frame, hand_lm, mp_hands.HAND_CONNECTIONS,
                                          mp_styles.get_default_hand_landmarks_style(),
                                          mp_styles.get_default_hand_connections_style())
                draw_label(frame, f"Collecting static '{label}'  count={len(data['static'][label])}")
            else:
                draw_label(frame, f"Show the pose for '{label}'")

            # FPS
            now = time.time()
            fps = 1.0 / max(1e-6, (now - last_time))
            last_time = now
            cv2.putText(frame, f"FPS: {fps:.1f}", (10, frame.shape[0]-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

            cv2.imshow("Collect Static", frame)
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break

    save_data(data)
    cap.release()
    cv2.destroyAllWindows()


def collect_dynamic(label: str):
    data = load_data()
    data.setdefault("dynamic", {}).setdefault(label, [])

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise SystemExit("Could not open webcam")

    recording: List[np.ndarray] = []
    is_recording = False

    with mp_hands.Hands(model_complexity=1, max_num_hands=1, min_detection_confidence=0.6, min_tracking_confidence=0.6) as hands:
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            res = hands.process(rgb)

            if res.multi_hand_landmarks:
                hand_lm = res.multi_hand_landmarks[0]
                pts = np.array([[lm.x, lm.y, lm.z] for lm in hand_lm.landmark], dtype=np.float32)
                feats = extract_features(pts)
                mp_drawing.draw_landmarks(frame, hand_lm, mp_hands.HAND_CONNECTIONS,
                                          mp_styles.get_default_hand_landmarks_style(),
                                          mp_styles.get_default_hand_connections_style())
                if is_recording:
                    recording.append(feats.angles)
                    draw_label(frame, f"Recording '{label}'  len={len(recording)}")
                else:
                    draw_label(frame, f"Press 'r' to record '{label}' sequence")
            else:
                draw_label(frame, "Show your hand in view")

            cv2.imshow("Collect Dynamic", frame)
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('r'):
                is_recording = not is_recording
                if not is_recording and len(recording) > 8:
                    seq = np.asarray(recording, dtype=np.float32).tolist()
                    data["dynamic"][label].append(seq)
                    recording = []
                elif not is_recording:
                    recording = []

    save_data(data)
    cap.release()
    cv2.destroyAllWindows()


def run_recognition(cfg: RecognizerConfig):
    data = load_data()
    static_db: Dict[str, List[List[float]]] = data.get("static", {})
    dynamic_db: Dict[str, List[List[List[float]]]] = data.get("dynamic", {})

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        raise SystemExit("Could not open webcam")

    ema = EMA(alpha=cfg.ema_alpha, dim=63 + 14)
    state = RecognizerState(votes=deque(maxlen=cfg.static_vote_window),
                            angles_buffer=deque(maxlen=cfg.dynamic_buffer),
                            fps_hist=deque(maxlen=30))

    with mp_hands.Hands(model_complexity=1, max_num_hands=1, min_detection_confidence=0.6, min_tracking_confidence=0.6) as hands:
        last_time = time.time()
        while True:
            ok, frame = cap.read()
            if not ok:
                break
            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            res = hands.process(rgb)

            gesture_text = ""
            conf_text = ""

            if res.multi_hand_landmarks:
                hand_lm = res.multi_hand_landmarks[0]
                pts = np.array([[lm.x, lm.y, lm.z] for lm in hand_lm.landmark], dtype=np.float32)
                feats = extract_features(pts)
                sm = ema.update(feats.vec)

                # Static KNN
                label, conf = knn_classify(sm, static_db)
                if label:
                    state.votes.append(label)
                else:
                    state.votes.append("")
                most = Counter([v for v in state.votes if v]).most_common(1)
                if most:
                    gesture_text = most[0][0]
                    conf_text = f"{conf:.2f}"

                # Dynamic: update buffer and test DTW against templates
                state.angles_buffer.append(feats.angles)
                best_dyn = ("", float("inf"))
                if dynamic_db and len(state.angles_buffer) > 10:
                    buf = np.asarray(list(state.angles_buffer), dtype=np.float32)
                    for lab, seqs in dynamic_db.items():
                        for template in seqs:
                            template_np = np.asarray(template, dtype=np.float32)
                            # Use last len(template)*1.5 frames for matching window
                            w = min(len(buf), int(len(template_np) * 3))
                            window = buf[-w:]
                            d = dtw_distance(window, template_np)
                            if d < best_dyn[1]:
                                best_dyn = (lab, d)
                    # Convert distance to confidence in [0,1]
                    if best_dyn[0]:
                        dyn_conf = max(0.0, 1.0 - best_dyn[1])
                        if dyn_conf >= cfg.dynamic_thresh:
                            gesture_text = best_dyn[0]
                            conf_text = f"{dyn_conf:.2f}"

                mp_drawing.draw_landmarks(frame, hand_lm, mp_hands.HAND_CONNECTIONS,
                                          mp_styles.get_default_hand_landmarks_style(),
                                          mp_styles.get_default_hand_connections_style())

            # UI overlays
            if gesture_text:
                draw_label(frame, f"Gesture: {gesture_text}  conf={conf_text}", (10, 30))
            else:
                draw_label(frame, "Gesture: ...", (10, 30))

            # FPS
            now = time.time()
            fps = 1.0 / max(1e-6, (now - last_time))
            last_time = now
            state.fps_hist.append(fps)
            cv2.putText(frame, f"FPS: {np.mean(state.fps_hist):.1f}", (10, frame.shape[0]-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255), 1)

            cv2.imshow("Hand Gestures (Advanced)", frame)
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break

    cap.release()
    cv2.destroyAllWindows()


# ------------------------------
# CLI
# ------------------------------

def reset_data():
    if os.path.exists(DATA_FILE):
        os.remove(DATA_FILE)
        print("Deleted", DATA_FILE)
    else:
        print("No data file to delete.")


def main():
    ap = argparse.ArgumentParser(description="Advanced Hand Gesture Recognition")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--collect", choices=["static", "dynamic"], help="Collect samples")
    g.add_argument("--run", action="store_true", help="Run real‑time recognition")
    g.add_argument("--reset", action="store_true", help="Reset dataset")
    ap.add_argument("--label", type=str, default=None, help="Label name when collecting")
    ap.add_argument("--dyn-thresh", type=float, default=0.55, help="Dynamic gesture confidence threshold [0..1]")
    ap.add_argument("--vote", type=int, default=10, help="Static majority vote window")
    args = ap.parse_args()

    if args.reset:
        reset_data()
        return

    if args.collect:
        if not args.label:
            raise SystemExit("--label is required when using --collect")
        if args.collect == "static":
            collect_static(args.label)
        else:
            collect_dynamic(args.label)
        return

    if args.run:
        cfg = RecognizerConfig(static_vote_window=args.vote, dynamic_thresh=args.dyn_thresh)
        run_recognition(cfg)
        return


if __name__ == "__main__":
    main()
