// Load saved data
let sessions = JSON.parse(localStorage.getItem("studySessions")) || [];
const theme = localStorage.getItem("theme") || "light";
document.body.className = theme;
document.getElementById("themeSelector").value = theme;

function save() {
  localStorage.setItem("studySessions", JSON.stringify(sessions));
}

// render list
function render() {
  const list = document.getElementById("studyList");
  const total = document.getElementById("total");
  list.innerHTML = "";
  let sum = 0;

  sessions.forEach((s, i) => {
    sum += s.minutes;
    const li = document.createElement("li");
    li.innerHTML = `${s.subject} — ${s.minutes}m <button data-i="${i}">✕</button>`;
    list.appendChild(li);
  });

  total.textContent = sum;
}
render();

// add session
document.getElementById("studyForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const subject = document.getElementById("subject").value.trim();
  const minutes = parseInt(document.getElementById("minutes").value);
  if (!subject || !minutes) return;
  
  sessions.push({ subject, minutes });
  save();
  render();
  e.target.reset();
});

// delete entry
document.getElementById("studyList").addEventListener("click", (e) => {
  if (e.target.dataset.i !== undefined) {
    sessions.splice(e.target.dataset.i, 1);
    save();
    render();
  }
});

// clear all
document.getElementById("clearBtn").onclick = () => {
  sessions = [];
  save();
  render();
};

// theme switcher
const selector = document.getElementById("themeSelector");
selector.onchange = () => {
  document.body.className = selector.value;
  localStorage.setItem("theme", selector.value);
};
