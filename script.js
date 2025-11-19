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
