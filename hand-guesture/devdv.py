import cv2
import mediapipe as mp
import pyttsx3
import numpy as np

# Initialize Text-to-Speech Engine
engine = pyttsx3.init()

gesture_dict = {
    "FIVE": "Hello - Open Hand Detected",
    "FIST": "Stop - Closed Fist Detected",
    "ONE": "One - Pointing Gesture Detected",
    "TWO": "Peace - Two Fingers Detected",
    "THUMB_UP": "Good - Thumbs Up Detected"
}

# Mediapipe setup
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

def speak_text(text):
    engine.say(text)
    engine.runAndWait()

def classify_gesture(hand_landmarks):
    # Get landmark coordinates
    tips = [4, 8, 12, 16, 20]  # Thumb, Index, Middle, Ring, Pinky
    fingers = []
    for tip in tips[1:]:
        # If tip is above pip joint, finger is open
        if hand_landmarks.landmark[tip].y < hand_landmarks.landmark[tip - 2].y:
            fingers.append(1)
        else:
            fingers.append(0)
    # Thumb
    if hand_landmarks.landmark[tips[0]].x > hand_landmarks.landmark[tips[0] - 1].x:
        thumb = 1
    else:
        thumb = 0

    # Gesture logic
    if sum(fingers) == 0 and thumb == 0:
        return "FIST"
    elif sum(fingers) == 4 and thumb == 1:
        return "FIVE"
    elif fingers[0] == 1 and sum(fingers[1:]) == 0:
        return "ONE"
    elif fingers[0] == 1 and fingers[1] == 1 and sum(fingers[2:]) == 0:
        return "TWO"
    elif thumb == 1 and sum(fingers) == 0:
        return "THUMB_UP"
    else:
        return None

cap = cv2.VideoCapture(0)
last_gesture = ""
gesture_count = 0
gesture_threshold = 10

print("Hand Gesture Recognition Started! (Mediapipe)")
print("Press 'q' to quit")

with mp_hands.Hands(
    max_num_hands=1,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.7
) as hands:
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.flip(frame, 1)
        h, w, c = frame.shape

        # Convert to RGB
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb)

        current_gesture = None

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                gesture = classify_gesture(hand_landmarks)
                if gesture:
                    current_gesture = gesture

        # Gesture stability check
        if current_gesture == last_gesture and current_gesture:
            gesture_count += 1
        else:
            gesture_count = 0
            last_gesture = current_gesture

        # If gesture is stable for enough frames, recognize it
        if gesture_count >= gesture_threshold and current_gesture in gesture_dict:
            gesture_text = gesture_dict[current_gesture]
            speak_text(gesture_text)
            cv2.putText(frame, gesture_text, (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)
            gesture_count = 0

        if current_gesture:
            cv2.putText(frame, f"Gesture: {current_gesture}", (50, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)

        cv2.imshow("Hand Gesture Recognition", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()