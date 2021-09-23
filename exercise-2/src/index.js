import { getTodoList, setTodoListState } from "./store";
import hashId from "./utils/hash-id";
import "./style.scss";

export function initialize() {
  const taskForm = document.getElementById("new-task-form");
  const taskInput = document.getElementById("new-task");
  const addButton = document.getElementById("new-task-button");
  const incompleteTasksHolder = document.getElementById("incomplete-tasks");
  const completedTasksHolder = document.getElementById("completed-tasks");

  /**
   * this is not necessary because after we removed the
   * "outline: none" style from input and buttons, now
   * we can navigate between rendered dom elements with "tab" key
   */
  // document.addEventListener("keypress", (event) => {
  //   const { key } = event;

  //   if (key === "Enter") {
  //     addTask();
  //   }
  // });

  taskForm.onsubmit = (event) => {
    event.preventDefault();
  };

  const updateObjectItemAttribute = (id, attr, value) => {
    const updatedTodoList = getTodoList().map((item) => {
      if (item.id === id) {
        item[attr] = value;
      }

      return item;
    });

    setTodoListState(updatedTodoList);
  };

  const createNewTaskElement = function ({ id, label, done, isEditing }) {
    const listItemElement = document.createElement("li");
    const checkBoxElement = document.createElement("input");
    const labelElement = document.createElement("label");
    const editInputElement = document.createElement("input");
    const editButtonElement = document.createElement("button");
    const deleteButtonElement = document.createElement("button");

    listItemElement.setAttribute("id", id || hashId());

    checkBoxElement.type = "checkbox";
    checkBoxElement.checked = Boolean(done);
    editInputElement.type = "text";
    editButtonElement.innerText = "Edit";
    editButtonElement.className = "edit";
    deleteButtonElement.innerText = "Delete";
    deleteButtonElement.className = "delete";
    labelElement.innerText = label;

    listItemElement.appendChild(checkBoxElement);
    listItemElement.appendChild(labelElement);
    listItemElement.appendChild(editInputElement);
    listItemElement.appendChild(editButtonElement);
    listItemElement.appendChild(deleteButtonElement);

    if (isEditing) {
      editTask(listItemElement);
    }

    return listItemElement;
  };

  const addTask = function () {
    if (!taskInput.value) {
      return;
    }

    const listItemName = taskInput.value;
    const listItem = createNewTaskElement({
      label: listItemName,
    });
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    const updatedTodoList = [
      ...getTodoList(),
      {
        id: hashId(),
        label: listItemName,
        done: false,
        isEditing: false,
      },
    ];

    setTodoListState(updatedTodoList);

    setTimeout(() => {
      taskInput.value = "";
    });
  };

  const editTask = function (listItemElement) {
    const listItem = this ? this.parentNode : listItemElement;
    const id = listItem.getAttribute("id");
    const editInput = listItem.querySelectorAll("input[type=text")[0];
    const label = listItem.querySelector("label");
    const button = listItem.getElementsByTagName("button")[0];

    const containsClass = listItem.classList.contains("editMode");

    if (containsClass) {
      label.innerText = editInput.value;
      button.innerText = "Edit";
    } else {
      editInput.value = label.innerText;
      button.innerText = "Save";
    }

    updateObjectItemAttribute(id, "isEditing", !containsClass);

    listItem.classList.toggle("editMode");
  };

  const deleteTask = function () {
    const listItem = this.parentNode;
    const id = listItem.getAttribute("id");
    const ul = listItem.parentNode;
    ul.removeChild(listItem);

    const updatedTodoList = getTodoList().filter((item) => item.id !== id);

    setTodoListState(updatedTodoList);
  };

  const taskCompleted = function () {
    const listItem = this.parentNode;
    const id = listItem.getAttribute("id");
    completedTasksHolder.appendChild(listItem);

    updateObjectItemAttribute(id, "done", true);

    bindTaskEvents(listItem, taskIncomplete);
  };

  const taskIncomplete = function () {
    const listItem = this.parentNode;
    const id = listItem.getAttribute("id");
    incompleteTasksHolder.appendChild(listItem);

    updateObjectItemAttribute(id, "done", false);

    bindTaskEvents(listItem, taskCompleted);
  };

  const inputsOnChangeHandler = function (event) {
    const { value } = event.target;
    const listItem = this.parentNode;
    const id = listItem.getAttribute("id");

    updateObjectItemAttribute(id, "label", value);
  };

  const bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
    const [checkBox] = taskListItem.querySelectorAll("input[type=checkbox]");
    const [editInput] = taskListItem.querySelectorAll("input[type=text]");
    const [editButton] = taskListItem.querySelectorAll("button.edit");
    const [deleteButton] = taskListItem.querySelectorAll("button.delete");
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = checkBoxEventHandler;
    editInput.onchange = inputsOnChangeHandler;
  };

  addButton.addEventListener("click", addTask);

  getTodoList().forEach((item) => {
    const listItem = createNewTaskElement({ ...item });

    if (item.done) {
      completedTasksHolder.appendChild(listItem);
    } else {
      incompleteTasksHolder.appendChild(listItem);
    }

    bindTaskEvents(listItem, taskCompleted);
  });

  for (let i = 0; i < incompleteTasksHolder.children.length; i++) {
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
  }

  for (let i = 0; i < completedTasksHolder.children.length; i++) {
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
  }
}
