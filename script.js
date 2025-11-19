const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = `${task.subject} — ${task.minutes} min`;

    const del = document.createElement("span");
    del.textContent = "✖";
    del.classList.add("delete");

    del.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    li.appendChild(del);
    taskList.appendChild(li);
  });
}

addBtn.onclick = () => {
  const subject = taskInput.value.trim();
  const minutes = parseInt(timeInput.value.trim());

  if (!subject || !minutes) return;

  tasks.push({ subject, minutes });
  saveTasks();
  renderTasks();

  taskInput.value = "";
  timeInput.value = "";
};

clearBtn.onclick = () => {
  tasks = [];
  saveTasks();
  renderTasks();
};

renderTasks();
