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

