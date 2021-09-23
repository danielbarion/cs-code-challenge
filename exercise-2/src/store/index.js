import hashId from "../utils/hash-id";

export const setTodoListState = (todoList) => {
  // Run on the next main thread tick
  setTimeout(() => {
    todoList = [...todoList];

    setItem("state", { todoList });
  });
};

// Always get the updated todoList from storage
export const getTodoList = () => getItem("state").todoList;

const getItem = (key) =>
  localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
const setItem = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const initialize = () => {
  if (!getItem("state")) {
    setItem("state", {
      todoList: [
        { id: hashId(), label: "Pay Bills", done: false, isEditing: false },
        { id: hashId(), label: "Go Shopping", done: false, isEditing: true },
        { id: hashId(), label: "See the Doctor", done: true, isEditing: false },
      ],
    });
    return;
  }
};
