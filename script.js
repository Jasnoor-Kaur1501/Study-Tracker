// DOM elements
const form = document.getElementById("studyForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const clearBtn = document.getElementById("clearBtn");

// Load saved tasks on startup
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// Add task
form.addEventListener("submit", function (e) {
  e.preventDefault(); // stop page reload

  const text = taskInput.value.trim();
  if (text === "") return;

  const task = {
    id: Date.now(),
    text: text
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
});

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";

    li.innerHTML = `
      <span>${task.text}</span>
      <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
    `;

    taskList.appendChild(li);
  });
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Clear all
clearBtn.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderTasks();
});

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
