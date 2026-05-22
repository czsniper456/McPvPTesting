let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            renderTasks();
        });
    });

    document.getElementById('clearCompletedBtn').addEventListener('click', clearCompleted);
    document.getElementById('clearAllBtn').addEventListener('click', clearAll);
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();

    if (!text) {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date()
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    input.value = '';
    input.focus();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let filtered = tasks;
    if (currentFilter === 'active') {
        filtered = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = tasks.filter(t => t.completed);
    }

    if (filtered.length === 0) {
        taskList.innerHTML = '<div class="empty-state"><p>📭 No tasks yet!</p></div>';
    } else {
        filtered.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="task-text">${escapeHtml(task.text)}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            `;
            
            taskList.appendChild(li);
        });
    }

    updateStats();
}

function updateStats() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('completedCount').textContent = completed;
}

function clearCompleted() {
    if (confirm('Clear all completed tasks?')) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    }
}

function clearAll() {
    if (confirm('⚠️ Delete ALL tasks? This cannot be undone!')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}