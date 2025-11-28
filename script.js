/* ============================
   DATA + STORAGE
============================= */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let logs = JSON.parse(localStorage.getItem("logs")) || {};
let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const taskList = document.getElementById("taskList");
const totalsBox = document.getElementById("totals");
const clearBtn = document.getElementById("clearBtn");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function saveLogs() {
  localStorage.setItem("logs", JSON.stringify(logs));
}

/* ============================
   TOTALS + PROGRESS BAR
============================= */

function calculateTotals() {
  const today = new Date().toISOString().slice(0, 10);
  const daily = logs[today] || 0;

  let weekly = 0;
  const now = new Date();

  for (const [dateStr, mins] of Object.entries(logs)) {
    const date = new Date(dateStr);
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) weekly += mins;
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

const DAILY_GOAL = 240;
function updateProgressBar() {
  const today = new Date().toISOString().slice(0, 10);
  const dailyMinutes = logs[today] || 0;
  let percent = Math.min((dailyMinutes / DAILY_GOAL) * 100, 100);
  document.getElementById("progressBar").style.width = percent + "%";
}

/* ============================
   CONFETTI
============================= */

function spawnConfetti() {
  const corners = [
    { x: 40, y: 40 },                                   // top-left
    { x: window.innerWidth - 40, y: 40 },               // top-right
    { x: 40, y: window.innerHeight - 40 },              // bottom-left
    { x: window.innerWidth - 40, y: window.innerHeight - 40 } // bottom-right
  ];

  const colors = [
    "#ffffff", "#d9d9d9", "#e8e8ff",
    "#ffddee", "#f3e7ff", "#e0fff3"
  ];

  corners.forEach(corner => {
    for (let i = 0; i < 10; i++) {
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");

      const size = Math.random() * 6 + 4;
      confetti.style.width = size + "px";
      confetti.style.height = size + "px";

      confetti.style.left = `${corner.x}px`;
      confetti.style.top = `${corner.y}px`;

      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 60 + 20;

      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      confetti.style.setProperty("--dx", `${dx}px`);
      confetti.style.setProperty("--dy", `${dy}px`);

      document.getElementById("confetti-container").appendChild(confetti);

      setTimeout(() => confetti.remove(), 1200);
    }
  });
}


/* ============================
   RENDER TASKS
============================= */

function renderTasks() {
  taskList.innerHTML = "";

  const filtered = tasks.filter(t => {
    if (currentFilter === "completed") return t.completed;
    if (currentFilter === "uncompleted") return !t.completed;
    if (currentFilter === "long") return t.minutes > 30;
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

/* ============================
   ADD TASK
============================= */

document.getElementById("addBtn").addEventListener("click", () => {
  const subject = taskInput.value.trim();
  const minutes = Number(timeInput.value.trim());
  if (!subject || !minutes) return;

  const today = new Date().toISOString().slice(0, 10);

  tasks.push({
    subject,
    minutes,
    completed: false,
    date: today
  });

  logs[today] = (logs[today] || 0) + minutes;
  saveLogs();

  taskInput.value = "";
  timeInput.value = "";

  renderTasks();
});

/* ============================
   CHECKBOX LOGIC + CONFETTI
============================= */

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("task-checkbox")) {
    const index = e.target.dataset.index;

    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();

    if (tasks[index].completed) {
      const rect = e.target.getBoundingClientRect();
      spawnConfetti(rect.left, rect.top);
    }
  }
});

/* ============================
   SWIPE DELETE
============================= */

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("swipe-delete")) {
    const index = e.target.dataset.index;
    const day = tasks[index].date;

    logs[day] = Math.max((logs[day] || 0) - tasks[index].minutes, 0);
    saveLogs();

    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
});

/* ============================
   FILTERS
============================= */

document.querySelectorAll(".pill").forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    document.querySelectorAll(".pill")
      .forEach(p => p.classList.remove("active"));
    btn.classList.add("active");

    renderTasks();
  });
});

const filterIcon = document.getElementById("filterIcon");
const filterPopup = document.getElementById("filterPopup");

filterIcon.addEventListener("click", () => {
  filterPopup.style.display =
    filterPopup.style.display === "flex" ? "none" : "flex";
});

document.querySelectorAll("#filterPopup div").forEach(opt => {
  opt.addEventListener("click", () => {
    currentFilter = opt.dataset.filter;

    document.querySelectorAll(".pill")
      .forEach(p => p.classList.remove("active"));

    document
      .querySelector(`.pill[data-filter="${currentFilter}"]`)
      .classList.add("active");

    filterPopup.style.display = "none";
    renderTasks();
  });
});

/* ============================
   OLED MODE
============================= */

document.getElementById("oledToggle").addEventListener("click", () => {
  document.body.classList.toggle("oled");
});

/* ============================
   INITIAL RENDER
============================= */

renderTasks();
renderTotals();
