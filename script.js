// Variables - storing data
let tasks = [];
let completedTasks = 0;

// DOM elements - connecting to HTML
const taskInput = document.getElementById('task-input');
const addTaskButton = document.getElementById('add-task');
const taskList = document.getElementById('task-list');
const completedCountElement = document.getElementById('completed-count');
const totalCountElement = document.getElementById('total-count');
const productivityElement = document.getElementById('productivity');
const currentDateElement = document.getElementById('current-date');
const currentTimeElement = document.getElementById('current-time');

// Function to update the date and time
function updateDateTime() {
    // Creating a new Date object
    const now = new Date();
    
    // String concatenation for date
    const dateString = now.toDateString();
    currentDateElement.textContent = dateString;
    
    // Template literals for time (string interpolation)
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    currentTimeElement.textContent = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

// Function to add a new task
function addTask() {
    // Getting input value
    const taskText = taskInput.value.trim();
    
    // Check if input is empty
    if (taskText === '') {
        return; // Exit the function if empty
    }
    
    // Create task object
    const task = {
        id: Date.now(), // Unique ID using current timestamp
        text: taskText,
        completed: false
    };
    
    // Add task to array
    tasks.push(task);
    
    // Clear input field
    taskInput.value = '';
    
    // Update the display
    renderTasks();
    updateStats();
    
    // Save to localStorage
    saveTasks();
}

// Function to render all tasks to the list
function renderTasks() {
    // Clear the list first
    taskList.innerHTML = '';
    
    // Loop through all tasks
    tasks.forEach(task => {
        // Create list item
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }
        
        // Using template literals for the inner HTML
        li.innerHTML = `
            <div>
                <input type="checkbox" class="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                <span>${task.text}</span>
            </div>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
        `;
        
        // Add to the list
        taskList.appendChild(li);
    });
}

// Function to toggle task completion
function toggleTask(id) {
    // Find and update the task
    tasks = tasks.map(task => {
        // If this is the task we're looking for
        if (task.id === id) {
            // Toggle the completed status
            task.completed = !task.completed;
            
            // Update completed count
            if (task.completed) {
                completedTasks += 1;
            } else {
                completedTasks -= 1;
            }
        }
        return task;
    });
    
    // Update display
    renderTasks();
    updateStats();
    saveTasks();
}

// Function to delete a task
function deleteTask(id) {
    // Check if the task was completed before removing
    const taskToDelete = tasks.find(task => task.id === id);
    if (taskToDelete && taskToDelete.completed) {
        completedTasks -= 1;
    }
    
    // Remove the task from array
    tasks = tasks.filter(task => task.id !== id);
    
    // Update display
    renderTasks();
    updateStats();
    saveTasks();
}

// Function to update statistics
function updateStats() {
    // Update task counts
    totalCountElement.textContent = tasks.length;
    completedCountElement.textContent = completedTasks;
    
    // Calculate and update productivity percentage
    let productivity = 0;
    if (tasks.length > 0) {
        productivity = Math.floor((completedTasks / tasks.length) * 100);
    }
    productivityElement.textContent = `${productivity}%`;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', completedTasks);
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    const savedCompletedCount = localStorage.getItem('completedTasks');
    
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    
    if (savedCompletedCount) {
        completedTasks = parseInt(savedCompletedCount);
    }
    
    renderTasks();
    updateStats();
}

// Event Listeners - responding to user actions
addTaskButton.addEventListener('click', addTask);

// Allow adding task by pressing Enter
taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Event delegation for checkboxes and delete buttons
taskList.addEventListener('click', function(event) {
    // If a checkbox was clicked
    if (event.target.classList.contains('checkbox')) {
        const id = parseInt(event.target.getAttribute('data-id'));
        toggleTask(id);
    }
    
    // If a delete button was clicked
    if (event.target.classList.contains('delete-btn')) {
        const id = parseInt(event.target.getAttribute('data-id'));
        deleteTask(id);
    }
});

// Initialize
updateDateTime();
// Update date/time every second
setInterval(updateDateTime, 1000);
// Load saved tasks
loadTasks();