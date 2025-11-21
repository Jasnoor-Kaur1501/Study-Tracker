const subjectInput = document.getElementById("subject");
const minutesInput = document.getElementById("minutes");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const clearAllBtn = document.getElementById("clearAll");

function addTask() {
  const subject = subjectInput.value.trim();
  const minutes = minutesInput.value.trim();

  if (!subject || !minutes) return;

  const li = document.createElement("li");
  li.classList.add("task-item");

  li.innerHTML = `
      <div class="checkbox"></div>
      <span>${subject} — ${minutes} min</span>
      <span class="delete-btn">×</span>
  `;

  taskList.appendChild(li);

  subjectInput.value = "";
  minutesInput.value = "";
}

addBtn.addEventListener("click", addTask);

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkbox")) {
    e.target.classList.toggle("checked");
  }

  if (e.target.classList.contains("delete-btn")) {
    e.target.parentElement.remove();
  }
});

clearAllBtn.addEventListener("click", () => {
  taskList.innerHTML = "";
});
// ============================
// Study Tracker (LocalStorage)
// ============================

// Load tasks from localStorage OR empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Elements
const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks on screen
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <span>${task.subject} — ${task.minutes} min</span>
      <button class="delete-btn" data-index="${index}">✕</button>
    `;

    taskList.appendChild(li);
  });

  saveTasks();
}

// Add new task
document.getElementById("addBtn").addEventListener("click", () => {
  const subject = taskInput.value.trim();
  const minutes = timeInput.value.trim();

  if (!subject || !minutes) return;

  tasks.push({
    subject,
    minutes: parseInt(minutes),
    date: new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  });

  taskInput.value = "";
  timeInput.value = "";

  renderTasks();
});

// Delete a single task
taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.getAttribute("data-index");
    tasks.splice(index, 1);
    renderTasks();
  }
});

// Clear all tasks
clearBtn.addEventListener("click", () => {
  tasks = [];
  renderTasks();
});

// Initial render on page load
renderTasks();

