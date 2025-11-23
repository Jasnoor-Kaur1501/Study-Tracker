/* ============================
   Study Tracker (LocalStorage)
   + Daily + Weekly Totals
   ============================ */

// Load tasks OR empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load logs for totals OR empty object
let logs = JSON.parse(localStorage.getItem("logs")) || {};


// Elements
const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");
const totalsBox = document.getElementById("totals"); // <div id="totals"></div> in HTML


// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Save logs
function saveLogs() {
  localStorage.setItem("logs", JSON.stringify(logs));
}


// ===== Calculate Daily + Weekly Totals =====
function calculateTotals() {
  const today = new Date().toISOString().slice(0, 10);
  const daily = logs[today] || 0;

  let weekly = 0;
  const now = new Date();

  for (const [dateStr, mins] of Object.entries(logs)) {
    const date = new Date(dateStr);
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) {
      weekly += mins;
    }
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
// Mark task completed/uncompleted
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("task-checkbox")) {
    const index = e.target.getAttribute("data-index");

    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }
});

// ===== Render Tasks =====
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
  <div class="task-checkbox ${task.completed ? "checked" : ""}" data-index="${index}"></div>
  <span class="${task.completed ? "completed-task" : ""}">
    ${task.subject}: ${task.minutes} min
  </span>
  <button class="delete-btn" data-index="${index}">✕</button>
`;



    taskList.appendChild(li);
  });

  saveTasks();
  renderTotals(); // update totals whenever tasks update
}


// ===== Add New Task =====
document.getElementById("addBtn").addEventListener("click", () => {
  const subject = taskInput.value.trim();
  const minutes = timeInput.value.trim();

  if (!subject || !minutes) return;

  const mins = parseInt(minutes);

  tasks.push({
    subject,
    minutes: mins,
    date: new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  });

  // Log today's minutes
  const today = new Date().toISOString().slice(0, 10);
  logs[today] = (logs[today] || 0) + mins;
  saveLogs();

  taskInput.value = "";
  timeInput.value = "";

  renderTasks();
});


// ===== Delete a Single Task =====
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.getAttribute("data-index");

    // Subtract minutes from logs when deleting
    const removedTask = tasks[index];
    const day = removedTask.date;

    logs[day] = Math.max(0, (logs[day] || 0) - removedTask.minutes);
    saveLogs();

    tasks.splice(index, 1);
    renderTasks();
  }
});


// ===== Clear All Tasks =====
clearBtn.addEventListener("click", () => {
  tasks = [];
  renderTasks();
});
// ===== Progress Bar =====
const DAILY_GOAL = 240; // 4 hours

function updateProgressBar() {
  const today = new Date().toISOString().slice(0, 10);
  const dailyMinutes = logs[today] || 0;

  let percent = (dailyMinutes / DAILY_GOAL) * 100;
  if (percent > 100) percent = 100;

  const bar = document.getElementById("progressBar");
  bar.style.width = percent + "%";
}

// ===== Initial Render =====
renderTasks();
renderTotals();
