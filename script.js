/* ============================
   Study Tracker Logic (Fixed)
   ============================ */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let logs = JSON.parse(localStorage.getItem("logs")) || {};
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");
const totalsBox = document.getElementById("totals");

function saveTasks() { localStorage.setItem("tasks", JSON.stringify(tasks)); }
function saveLogs() { localStorage.setItem("logs", JSON.stringify(logs)); }

/* ===== TOTALS ===== */
function calculateTotals() {
  const today = new Date().toISOString().slice(0, 10);
  const daily = logs[today] || 0;

  let weekly = 0;
  const now = new Date();

  for (const [dateStr, mins] of Object.entries(logs)) {
    const date = new Date(dateStr);
    if ((now - date) / (1000 * 60 * 60 * 24) <= 7) weekly += mins;
  }

  return { daily, weekly };
}

function renderTotals() {
  const { daily, weekly } = calculateTotals();
  totalsBox.innerHTML = `
    <div>Today: ${daily} min</div>
    <div>This Week: ${weekly} min</div>
  `;
  updateProgressBar();
}

/* ===== RENDER TASKS ===== */
function renderTasks() {
  taskList.innerHTML = "";

  const filtered = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "uncompleted") return !task.completed;
    if (currentFilter === "long") return task.minutes > 30;
    return true;
  });

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <div class="task-content">
        <div class="task-checkbox ${task.completed ? "checked" : ""}" data-index="${index}"></div>
        <span class="${task.completed ? "completed-task" : ""}">
          ${task.subject}: ${task.minutes} min
        </span>
      </div>
      <div class="swipe-delete" data-index="${index}">✕</div>
    `;

    taskList.appendChild(li);
  });

  saveTasks();
  renderTotals();
}

/* ===== ADD TASK ===== */
document.getElementById("addBtn").addEventListener("click", () => {
  const subject = taskInput.value.trim();
  const minutes = timeInput.value.trim();

  if (!subject || !minutes) return;

  const mins = parseInt(minutes);
  const today = new Date().toISOString().slice(0, 10);

  tasks.push({ subject, minutes: mins, completed: false, date: today });
  logs[today] = (logs[today] || 0) + mins;

  saveLogs();
  taskInput.value = "";
  timeInput.value = "";

  renderTasks();
});

/* ===== CHECKBOX TOGGLE ===== */
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("task-checkbox")) {
    const index = e.target.getAttribute("data-index");
    tasks[index].completed = !tasks[index].completed;

    if (tasks[index].completed) {
      const box = e.target.getBoundingClientRect();
      spawnConfetti(box.left, box.top);
    }

    saveTasks();
    renderTasks();
  }
});

/* ===== CLEAR ALL ===== */
clearBtn.addEventListener("click", () => {
  tasks = [];
  logs = {};
  saveTasks();
  saveLogs();
  renderTasks();
});

/* ===== PROGRESS BAR ===== */
const DAILY_GOAL = 240;

function updateProgressBar() {
  const today = new Date().toISOString().slice(0, 10);
  const mins = logs[today] || 0;
  const percent = Math.min((mins / DAILY_GOAL) * 100, 100);
  document.getElementById("progressBar").style.width = percent + "%";
}

/* ===== FILTERS ===== */
document.querySelectorAll(".pill").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    syncFilters();
    renderTasks();
  });
});

function syncFilters() {
  document.querySelectorAll(".pill").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.filter === currentFilter)
  );
}

/* Popup */
document.getElementById("filterIcon").addEventListener("click", () => {
  const popup = document.getElementById("filterPopup");
  popup.style.display = popup.style.display === "flex" ? "none" : "flex";
});

document.querySelectorAll("#filterPopup div").forEach(option => {
  option.addEventListener("click", () => {
    currentFilter = option.dataset.filter;
    syncFilters();
    renderTasks();
    document.getElementById("filterPopup").style.display = "none";
  });
});

/* ===== SWIPE TO DELETE ===== */
let startX = 0, currentX = 0, dragging = false;

taskList.addEventListener("touchstart", e => {
  const item = e.target.closest(".task-item");
  if (!item) return;
  startX = e.touches[0].clientX;
  dragging = true;
});

taskList.addEventListener("touchmove", e => {
  if (!dragging) return;
  const item = e.target.closest(".task-item");
  if (!item) return;
  currentX = e.touches[0].clientX;
  const diff = currentX - startX;
  if (diff < 0) {
    item.querySelector(".task-content").style.transform = `translateX(${diff}px)`;
  }
});

taskList.addEventListener("touchend", e => {
  const item = e.target.closest(".task-item");
  if (!item) return;
  dragging = false;
  const diff = currentX - startX;

  if (diff < -60) {
    item.querySelector(".task-content").style.transform = "translateX(-70px)";
  } else {
    item.querySelector(".task-content").style.transform = "translateX(0)";
  }
});

/* DELETE via swipe button */
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("swipe-delete")) {
    const index = e.target.dataset.index;
    const day = tasks[index].date;

    logs[day] = Math.max((logs[day] || 0) - tasks[index].minutes, 0);

    tasks.splice(index, 1);
    saveTasks();
    saveLogs();
    renderTasks();
  }
});

/* ===== CONFETTI ===== */
function spawnConfetti(x, y) {
  const container = document.getElementById("confetti-container");
  for (let i = 0; i < 8; i++) {
    const dot = document.createElement("div");
    dot.className = "confetti";
    dot.style.left = x + (Math.random() * 20 - 10) + "px";
    dot.style.top = y + (Math.random() * 10 - 5) + "px";
    container.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
  }
}

/* ===== OLED MODE ===== */
document.getElementById("oledToggle").addEventListener("click", () => {
  document.body.classList.toggle("oled");
});

/* INITIAL RENDER */
renderTasks();
renderTotals();
