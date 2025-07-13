// script.js
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function notifyDueTasks() {
  tasks.forEach(task => {
    if (!task.completed && task.due) {
      const dueTime = new Date(task.due).getTime();
      const now = Date.now();
      const timeDiff = dueTime - now;
      if (timeDiff > 0 && timeDiff < 3600000) {
        alert(`Reminder: Task "${task.text}" is due within an hour.`);
      }
    }
  });
}

function exportToCSV() {
  let csv = 'Task,Priority,Completed,Created,Due\n';
  tasks.forEach(task => {
    csv += `${task.text},${task.priority},${task.completed},${task.created},${task.due}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'tasks.csv';
  a.click();
}

function toggleDarkMode() {
  document.body.classList.toggle('dark');
}

function toggleSettings() {
  const panel = document.getElementById('settingsPanel');
  panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  const container = document.querySelector('.container');
  taskList.innerHTML = '';
  container.style.backgroundColor = document.getElementById('themeSelect').value;
  document.body.style.fontFamily = document.getElementById('fontSelect').value;
  document.body.style.fontSize = document.getElementById('fontSizeSelect').value;

  tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
  }).forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    const taskSpan = document.createElement('span');
    taskSpan.textContent = `${task.text} (Priority: ${task.priority})\nCreated: ${task.created}\nDue: ${task.due || 'N/A'}`;
    taskSpan.onclick = () => toggleComplete(index);
    li.appendChild(taskSpan);

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => editTask(index);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteTask(index);

    li.appendChild(editBtn);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById('taskInput');
  const priority = document.getElementById('prioritySelect').value;
  const due = document.getElementById('dueDateInput').value;
  const text = input.value.trim();
  if (text) {
    tasks.push({
      text,
      completed: false,
      priority,
      due,
      created: new Date().toLocaleString()
    });
    input.value = '';
    document.getElementById('dueDateInput').value = '';
    saveTasks();
    renderTasks();
  }
}

function handleKey(e) {
  if (e.key === 'Enter') addTask();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null) {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function filterTasks(type) {
  filter = type;
  renderTasks();
}

function sortByPriority() {
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  renderTasks();
}

function renameApp() {
  const input = document.getElementById('appTitleInput');
  const h2 = document.getElementById('appTitle');
  if (input.value.trim()) {
    h2.textContent = input.value.trim();
    h2.style.display = 'block';
    input.style.display = 'none';
  }
}

renderTasks();
notifyDueTasks();
