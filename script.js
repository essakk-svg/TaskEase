document.addEventListener("DOMContentLoaded", function () {
    console.log("TaskEase is ready!");
});
let tasks = [];

function addTask() {
    let taskInput = document.getElementById("taskInput").value.trim();
    let taskDateTime = document.getElementById("taskDateTime").value;

    if (taskInput === "" || taskDateTime === "") {
        alert("Please enter a task and select a date & time.");
        return;
    }

    let selectedDateTime = new Date(taskDateTime);
    let currentDateTime = new Date();

    if (selectedDateTime <= currentDateTime) {
        alert("Please select a future date and time.");
        return;
    }

    let task = {
        text: taskInput,
        dateTime: selectedDateTime.toISOString(),
        status: "Pending"
    };

    tasks.push(task);
    saveAndRenderTasks();

    // Clear input fields
    document.getElementById("taskInput").value = "";
    document.getElementById("taskDateTime").value = "";
}

function toggleStatus(index) {
    if (tasks[index].status === "Pending") {
        tasks[index].status = "Completed";
    } else {
        tasks[index].status = "Pending";
    }
    saveAndRenderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRenderTasks();
}

function saveAndRenderTasks() {
    // Sort tasks by date & time (earliest first)
    tasks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    let taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        let localTime = new Date(task.dateTime).toLocaleString();
        let statusClass = task.status === "Pending" ? "pending" : "completed";
        let statusIcon = task.status === "Pending" ? "🟡" : "✅";

        let actionButton = task.status === "Pending"
            ? `<button class="status-btn btn btn-outline-success" onclick="toggleStatus(${index})">✔</button>` // Tick button to mark as complete
            : `<button class="status-btn btn btn-outline-danger" onclick="toggleStatus(${index})">❌</button>`; // X button to mark as pending

        taskList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="task-text">${task.text}</span>
                <span class="task-time">${localTime}</span>
                <span class="task-status ${statusClass}">${statusIcon} ${task.status}</span>
                ${actionButton}
                <button class="delete-btn btn btn-outline-dark" onclick="deleteTask(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </li>
        `;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks)); // Save tasks
}

// Load saved tasks on page load
window.onload = function () {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        saveAndRenderTasks();
    }
};
