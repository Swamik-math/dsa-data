
// ========== To-Do List ========== //
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");

  if (taskInput.value.trim() === "") return;

  const li = document.createElement("li");
  li.textContent = taskInput.value;
  li.onclick = () => li.classList.toggle("done");

  taskList.appendChild(li);
  taskInput.value = "";
}

// ========== Pomodoro Timer ========== //
// ========== Pomodoro Timer ========== //
let timeLeft = 25 * 60;
let timerInterval;

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerElement = document.getElementById("timer");
  if (timerElement) {
    timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
}

function startPomodoro() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimer();
    } else {
      clearInterval(timerInterval);
      console.log("Pomodoro complete! Take a break.");
    }
  }, 1000);
}

function resetPomodoro() {
  clearInterval(timerInterval);
  timeLeft = 25 * 60;
  updateTimer();
}

updateTimer(); // Initial display

// ========== Theme Toggle ========== //
const themeToggleBtn = document.getElementById("themeToggle");
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  });
}

// ========== Sticky Notes ========== //
const notesContainer = document.getElementById("notesContainer");

function addStickyNote(content = "", id = Date.now()) {
  if (!notesContainer) return;

  const note = document.createElement("div");
  note.className = "sticky-note";
  note.setAttribute("draggable", "true");
  note.setAttribute("data-id", id);

  note.innerHTML = `
    <textarea placeholder="Write a note...">${content}</textarea>
    <button onclick="deleteNote(${id})">🗑️</button>
  `;

  const textarea = note.querySelector("textarea");
  textarea.addEventListener("input", saveNotes);

  note.addEventListener("dragstart", dragStart);
  note.addEventListener("dragover", dragOver);
  note.addEventListener("drop", drop);
  note.addEventListener("dragend", dragEnd);

  notesContainer.appendChild(note);
  saveNotes();
}

function deleteNote(id) {
  const note = document.querySelector(`.sticky-note[data-id="${id}"]`);
  if (note && notesContainer) {
    notesContainer.removeChild(note);
    saveNotes();
  }
}

function saveNotes() {
  const notes = [];
  document.querySelectorAll(".sticky-note").forEach(note => {
    const id = note.getAttribute("data-id");
    const content = note.querySelector("textarea").value;
    notes.push({ id, content });
  });
  localStorage.setItem("stickyNotes", JSON.stringify(notes));
}

function loadNotes() {
  const saved = JSON.parse(localStorage.getItem("stickyNotes") || "[]");
  saved.forEach(note => addStickyNote(note.content, note.id));
}

let dragSrc = null;

function dragStart(e) {
  dragSrc = this;
  e.dataTransfer.effectAllowed = 'move';
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  if (dragSrc !== this) {
    const srcTextarea = dragSrc.querySelector("textarea");
    const targetTextarea = this.querySelector("textarea");
    [srcTextarea.value, targetTextarea.value] = [targetTextarea.value, srcTextarea.value];
    saveNotes();
  }
}

function dragEnd() {
  dragSrc = null;
}

// ========== Initialize on Page Load ========== //
window.addEventListener("load", () => {
  updateTimer();
  loadNotes();
});


// ========== Daily Goals Tracker ========== //
function addGoal() {
  const input = document.getElementById("goalInput");
  const goalText = input.value.trim();
  if (!goalText) return;

  const li = document.createElement("li");
  li.textContent = goalText;
  li.onclick = () => {
    li.classList.toggle("completed");
    saveGoals();
  };

  document.getElementById("goalList").appendChild(li);
  input.value = "";
  saveGoals();
}

function saveGoals() {
  const goals = [];
  document.querySelectorAll("#goalList li").forEach(li => {
    goals.push({ text: li.textContent, completed: li.classList.contains("completed") });
  });
  localStorage.setItem("dailyGoals", JSON.stringify(goals));
}

function loadGoals() {
  const saved = JSON.parse(localStorage.getItem("dailyGoals") || "[]");
  saved.forEach(goal => {
    const li = document.createElement("li");
    li.textContent = goal.text;
    if (goal.completed) li.classList.add("completed");
    li.onclick = () => {
      li.classList.toggle("completed");
      saveGoals();
    };
    document.getElementById("goalList").appendChild(li);
  });
}


// ========== Reminders / Alarm ========== //
// Clear reminders on page refresh
localStorage.removeItem("reminders");

function addReminder() {
  const text = document.getElementById("reminderText").value.trim();
  const time = document.getElementById("reminderTime").value;
  if (!text || !time) return;

  const reminder = { text, time };
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.push(reminder);
  localStorage.setItem("reminders", JSON.stringify(reminders));
  renderReminders();
  document.getElementById("reminderText").value = "";
  document.getElementById("reminderTime").value = "";
}

function renderReminders() {
  const list = document.getElementById("reminderList");
  list.innerHTML = "";
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  reminders.forEach((rem, index) => {
    const li = document.createElement("li");
    li.textContent = `⏰ ${rem.time} - ${rem.text}`;
    list.appendChild(li);
  });
}

function checkReminders() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM
  const reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
  let updated = reminders.filter(rem => {
    if (rem.time === currentTime) {
      alert(`🔔 Reminder: ${rem.text}`);
      playBeep();
      return false; // remove from list
    }
    return true;
  });
  if (updated.length !== reminders.length) {
    localStorage.setItem("reminders", JSON.stringify(updated));
    renderReminders();
  }
}

function playBeep() {
  const beep = new Audio("https://www.soundjay.com/button/beep-07.wav");
  beep.play();
}

setInterval(checkReminders, 60000); // check every minute
window.addEventListener("load", renderReminders);


// breath taking--------------------
let countdownInterval;

function startFocus() {
  const mode = document.getElementById("focusMode").value;
  const duration = parseInt(document.getElementById("focusDuration").value);
  const circle = document.getElementById("breathingCircle");
  const timeText = document.getElementById("focusTimeLeft");

  circle.style.display = "block";
  if (mode === "loop") {
    timeText.textContent = "Relax and Breathe...";
  } else {
    let totalSeconds = duration * 60;
    updateFocusTimerText(totalSeconds);
    countdownInterval = setInterval(() => {
      totalSeconds--;
      updateFocusTimerText(totalSeconds);
      if (totalSeconds <= 0) stopFocus();
    }, 1000);
  }
}

function stopFocus() {
  document.getElementById("breathingCircle").style.display = "none";
  clearInterval(countdownInterval);
  document.getElementById("focusTimeLeft").textContent = "";
}

function updateFocusTimerText(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  document.getElementById("focusTimeLeft").textContent =
    `Remaining: ${min}:${sec < 10 ? "0" + sec : sec}`;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("focusMode").addEventListener("change", (e) => {
    const show = e.target.value === "timed";
    document.getElementById("focusDuration").style.display = show ? "inline-block" : "none";
  });
});



// Open and Close Calculator------------------------
const calculatorModal = document.getElementById('calculatorModal');
document.getElementById('calculatorBtn').onclick = () => {
  calculatorModal.style.display = 'block';
};
function closeCalculator() {
  calculatorModal.style.display = 'none';
}

// Calculator Logic
let expression = '';
function press(num) {
  expression += num;
  document.getElementById('calcDisplay').value = expression;
}
function calculate() {
  try {
    expression = eval(expression).toString();
    document.getElementById('calcDisplay').value = expression;
  } catch (err) {
    document.getElementById('calcDisplay').value = 'Error';
    expression = '';
  }
}
function clearDisplay() {
  expression = '';
  document.getElementById('calcDisplay').value = '';
}

// lofi music player-----------------

  const musicBtn = document.getElementById('musicBtn');
  const music = document.getElementById('backgroundMusic');
  let isPlaying = false;

  musicBtn.addEventListener('click', () => {
    if (isPlaying) {
      music.pause();
      musicBtn.textContent = "🎵";
    } else {
      music.play();
      musicBtn.textContent = "⏸️";
    }
    isPlaying = !isPlaying;
  });

// jpg to png converter----------


  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const convertBtn = document.getElementById('convertBtn');

  let currentImage = null;

  imageInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        currentImage = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a PNG or JPG file.");
    }
  });

  convertBtn.addEventListener('click', function () {
    if (!currentImage) return alert("Please upload an image first.");

    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const isPng = currentImage.includes("image/png");
      const newFormat = isPng ? "image/jpeg" : "image/png";
      const newExt = isPng ? "jpg" : "png";

      canvas.toBlob(function (blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `converted.${newExt}`;
        link.click();
      }, newFormat);
    };
    img.src = currentImage;
  });

// website blocker-------------

  let blockedSites = [];
  let focusEndTime = null;
  // let timerInterval = null;

  function addSite() {
    const input = document.getElementById("siteInput");
    const site = input.value.trim();
    if (site && !blockedSites.includes(site)) {
      blockedSites.push(site);
      updateBlockList();
    }
    input.value = '';
  }

  function updateBlockList() {
    const list = document.getElementById("blockList");
    list.innerHTML = '';
    blockedSites.forEach(site => {
      const li = document.createElement("li");
      li.textContent = `🔒 ${site}`;
      list.appendChild(li);
    });
  }

  function startBlocking() {
    const duration = parseInt(document.getElementById("focusTime").value);
    if (isNaN(duration) || duration <= 0) return alert("Enter valid time");

    const now = new Date().getTime();
    focusEndTime = now + duration * 60000;
    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);

    alert("Focus mode started! Avoid visiting blocked sites.");
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const remaining = focusEndTime - now;

    const display = document.getElementById("blockCountdown");
    if (remaining <= 0) {
      display.textContent = "✅ Focus session over!";
      clearInterval(timerInterval);
    } else {
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      display.textContent = `⏳ Stay focused! ${mins}m ${secs}s left`;
    }
  }

// news card--------------

  async function fetchNews() {
    const container = document.getElementById("newsContainer");
    container.innerHTML = "<p>Loading...</p>";

    try {
      // Placeholder API – replace with your preferred news source/API if needed
      const response = await fetch("https://api.currentsapi.services/v1/latest-news", {
        headers: {
          "Authorization": "https://gnews.io/" // Replace with your actual API key
        }
      });

      if (!response.ok) throw new Error("Failed to fetch news");

      const data = await response.json();

      container.innerHTML = "";
      data.news.slice(0, 5).forEach(item => {
        const link = document.createElement("a");
        link.href = item.url;
        link.target = "_blank";
        link.textContent = item.title;
        container.appendChild(link);
      });

    } catch (err) {
      container.innerHTML = "<p>Unable to load news.</p>";
      console.error(err);
    }
  }

  // Auto-fetch on page load
  window.addEventListener("DOMContentLoaded", fetchNews);



// video player---------------
// YouTube Video Player Functionality


// Get DOM elements
const playVideoBtn = document.getElementById("playVideoBtn");
const youtubeLinkInput = document.getElementById("youtubeLink");
const videoPopup = document.getElementById("videoPopup");
const videoFrame = document.getElementById("videoFrame");
const closeVideoBtn = document.getElementById("closeVideoBtn");

// Play button handler
playVideoBtn.addEventListener("click", () => {
  const url = youtubeLinkInput.value.trim();
  const videoId = extractYouTubeID(url);

  if (!videoId) {
    alert("Please enter a valid YouTube link.");
    return;
  }

  videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  videoPopup.style.display = "block";
});

// Close button handler
closeVideoBtn.addEventListener("click", () => {
  videoPopup.style.display = "none";
  videoFrame.src = ""; // stop the video
});

// Helper to extract YouTube video ID
function extractYouTubeID(url) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

