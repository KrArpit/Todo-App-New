const input = document.querySelector(".input");
const addButton = document.querySelector(".addButton");
const clearAll = document.querySelector(".clearAll");
const parentTaskLists = document.querySelector(".taskSection");
const deleteTask = document.querySelector(".fa-square-minus");
const statusControlButton = document.querySelectorAll(".control span");

let todos = JSON.parse(localStorage.getItem("todo-list"));
let isEditedTodo = false;
let editId;
let activeStatusId;

addButton.addEventListener("click", () => {
  // Trim user's input, so no blank space can be added as task.
  let userInputTask = input.value.trim();
  // If userInputTask = true the enter if
  if (userInputTask) {
    // if isEditedTodo=true (which means you want to show the edited task in list )
    if (isEditedTodo) {
      todos[editId].name = userInputTask;
      isEditedTodo = false;
    }
    // If we add task (not edited one)
    else {
      // Initially when localStroage is empty, we have to initialize todos as array otherwise we can't use push method.
      if (!todos) {
        todos = [];
      }
      let taskInfo = {
        name: userInputTask,
        status: "pending",
      };
      todos.push(taskInfo);
    }
    input.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    activeStatusId = document.querySelector("span.active").id;
    showTodoList(activeStatusId);
  }
});

// MAIN function 
function showTodoList(filter) {
  let list = "";
  if (todos) {
    todos.forEach((todo, todoIndex) => {
      // Check for each list weather they are completed or not, if completed set isCompleted value = checked.
      let isCompleted = (todo.status == "completed")? "checked" : "";
      if(filter == todo.status || filter == "all"){
      list += `<div class="taskList">
  <label for="${todoIndex}">
    <input type="checkbox" class="checkbox-round" id="${todoIndex}" onclick="updateStatus(this)" ${isCompleted}>
    <p class="list ${isCompleted}">${todo.name}</p>
  </label>
  <div class="icons">
    <i class="fa-regular fa-pen-to-square" onclick="editTaskFunction('${todo.name}', ${todoIndex})"></i>
    <i class="fa-regular fa-square-minus" onclick="deleteTaskFunction(${todoIndex},'${filter}')"></i>
  </div>
</div>`;
      }
    });
  }
  parentTaskLists.innerHTML = list || `<span class="message">You don't have any task here</span>`;
}
showTodoList("all"); // First function to get call

// -----------------------------------------------------------------------------------------------
// Update status(pending or completed) of task
function updateStatus(selectedTask){
    let taskInfo = selectedTask.parentElement.lastElementChild; // select p(tag)

    if(selectedTask.checked){
        taskInfo.classList.add("checked");
        todos[selectedTask.id].status = "completed"; 
    }else{
        taskInfo.classList.remove("checked");
        todos[selectedTask.id].status = "pending"
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));   
}
// Edit task function
function editTaskFunction(todoName, index) {
  input.value = todoName;
  editId = index;
  isEditedTodo = true;
  input.focus();
}
// Delete task function
function deleteTaskFunction(index, filter) {
    todos.splice(index, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodoList(filter);
  }
// Status Function - use to control between all, pending, completed
statusControlButton.forEach((span)=>{
    span.addEventListener("click", ()=>{
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        showTodoList(span.id);
    });
});
// Clear All function
clearAll.addEventListener("click", ()=>{
    if(todos && confirm("Are you want to clear all your tasks?")){ // Confirmation message before clearning all tasks.
    localStorage.clear();
    todos = JSON.parse(localStorage.getItem("todo-list"));
    showTodoList("all");
    }
});