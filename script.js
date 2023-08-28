const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const pendingTasksList = document.getElementById("pendingTasksList");
const completedTasksList = document.getElementById("completedTasksList");

addTaskBtn.addEventListener("click", addTask);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const taskItem = createTaskItem(taskText);
        pendingTasksList.appendChild(taskItem);
        saveTasksToLocalStorage();
        taskInput.value = "";
    }
}

function createTaskItem(taskText) {
    const taskItem = document.createElement("li");
    const taskDetails = document.createElement("div");
    taskDetails.className = "task-details";
    const taskTextElement = document.createElement("span");
    taskTextElement.className = "task-text";
    taskTextElement.textContent = taskText;
    const timestampElement = document.createElement("span");
    timestampElement.className = "timestamp";
    const timestamp = new Date().toLocaleString();
    timestampElement.textContent = timestamp;
    taskDetails.appendChild(taskTextElement);
    taskDetails.appendChild(timestampElement);
    const taskButtons = document.createElement("div");
    taskButtons.className = "task-buttons";
    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.textContent = "Complete";
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    taskButtons.appendChild(completeBtn);
    taskButtons.appendChild(editBtn);
    taskButtons.appendChild(deleteBtn);
    taskItem.appendChild(taskDetails);
    taskItem.appendChild(taskButtons);
    attachTaskButtons(taskItem);
    return taskItem;
}

function attachTaskButtons(taskItem) {
    const completeBtn = taskItem.querySelector(".complete-btn");
    const editBtn = taskItem.querySelector(".edit-btn");
    const deleteBtn = taskItem.querySelector(".delete-btn");
    
    completeBtn.addEventListener("click", () => {
        taskItem.classList.add("completed");
        const timestampElement = taskItem.querySelector(".timestamp");
        const timestamp = new Date().toLocaleString();
        timestampElement.textContent = timestamp;
        completedTasksList.appendChild(taskItem);
        saveTasksToLocalStorage();
    });
    
    editBtn.addEventListener("click", () => {
        const taskTextElement = taskItem.querySelector(".task-text");
        const newText = prompt("Edit task:", taskTextElement.textContent);
        if (newText !== null) {
            taskTextElement.textContent = newText;
            saveTasksToLocalStorage();
        }
    });
    
    deleteBtn.addEventListener("click", () => {
        taskItem.remove();
        saveTasksToLocalStorage();
    });
}

function saveTasksToLocalStorage() {
    const pendingTasks = [];
    const completedTasks = [];
    const taskItems = pendingTasksList.querySelectorAll("li");
    taskItems.forEach(taskItem => {
        const taskTextElement = taskItem.querySelector(".task-text");
        const isCompleted = taskItem.classList.contains("completed");
        const timestampElement = taskItem.querySelector(".timestamp");
        const task = {
            text: taskTextElement.textContent,
            completed: isCompleted,
            timestamp: timestampElement.textContent
        };
        if (isCompleted) {
            completedTasks.push(task);
        } else {
            pendingTasks.push(task);
        }
    });
    localStorage.setItem("pendingTasks", JSON.stringify(pendingTasks));
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

window.addEventListener("load", () => {
    const pendingTasks = JSON.parse(localStorage.getItem("pendingTasks")) || [];
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];
    pendingTasks.forEach(task => {
        const taskItem = createTaskItem(task.text);
        pendingTasksList.appendChild(taskItem);
        if (task.completed) {
            taskItem.classList.add("completed");
            const timestampElement = taskItem.querySelector(".timestamp");
            timestampElement.textContent = task.timestamp;
            completedTasksList.appendChild(taskItem);
        }
    });
});
