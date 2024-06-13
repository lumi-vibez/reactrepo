import React, { useEffect, useState } from "react";
import "./App.css";
import { MdDelete } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setAllTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdits] = useState("");
  const [currentEditedItem, setCurrentEdited] = useState("");

  const handleAddTodo = () => {
    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };

    let updatedTodoArr = [...allTodos];
    updatedTodoArr.push(newTodoItem);
    setAllTodos(updatedTodoArr);
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
  };

  const handleDeletedTodo = (index) => {
    let deletedTodo = [...allTodos];
    deletedTodo.splice(index, 1); // Corrected to remove only the item at the specified index

    localStorage.setItem("todolist", JSON.stringify(deletedTodo));
    setAllTodos(deletedTodo);
  };
  const handleComplete = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth();
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let completedOn = dd + "-" + mm + "-" + yyyy + "at" + h + ":" + m + ":";

    let filteredItem = {
      ...allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredItem);
    setCompletedTodos(updatedCompletedArr);
    handleDeletedTodo(index);
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedArr));
  };
  const handleDeletedCompletedTodo = (index) => {
    let deletedTodo = [...completedTodos];
    deletedTodo.splice(index, 1); // Corrected to remove only the item at the specified index

    localStorage.setItem("completedTodos", JSON.stringify(deletedTodo));
    setCompletedTodos(deletedTodo);
  };

  useEffect(() => {
    let savedTodo = JSON.parse(localStorage.getItem("todolist"));
    let savedCompletedTodo = JSON.parse(localStorage.getItem("completedTodos"));
    if (savedTodo) {
      setAllTodos(savedTodo);
    }

    if (savedCompletedTodo) {
      setCompletedTodos(savedCompletedTodo);
    }
  }, []);

  const handleEdit = (index) => {
    setCurrentEdited(allTodos[index]);
    setCurrentEdits(index);
  };

  const handleUpdatedTitle = (index, value) => {
    setCurrentEdited((prev) => {
      let updatedTodos = [...allTodos];
      updatedTodos[index] = { ...updatedTodos[index], title: value };
      setAllTodos(updatedTodos);
      return updatedTodos[index];
    });
  };
  const handleUpdatedDescription = (index, value) => {
    setCurrentEdited((prev) => {
      let updatedTodos = [...allTodos];
      updatedTodos[index] = { ...updatedTodos[index], description: value };
      setAllTodos(updatedTodos);
      return updatedTodos[index];
    });
  };
  const handleUpdatedTodo = () => {
    let updatedTodos = [...allTodos];
    updatedTodos[currentEdit] = currentEditedItem; // Use currentEdit for the index
    setAllTodos(updatedTodos);
    setCurrentEdited(""); // Reset currentEditedItem
    setCurrentEdits(""); // Reset currentEdit
  };
  return (
    <div className="App">
      <h1>MY TODOS</h1>
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompleteScreen === false && "active"}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`secondaryBtn ${isCompleteScreen === true && "active"}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>
        <div className="todo-list">
          {isCompleteScreen === false &&
            allTodos.map((item, index) =>
              currentEdit === index ? (
                <div className="edit-wrapper" key={index}>
                  <input
                    placeholder="Updated Title"
                    onChange={(e) => handleUpdatedTitle(index, e.target.value)}
                    value={currentEditedItem.title}
                  />
                  <input
                    placeholder="Updated Description"
                    onChange={(e) =>
                      handleUpdatedDescription(index, e.target.value)
                    }
                    value={currentEditedItem.description}
                  />
                  <button
                    type="button"
                    onClick={handleUpdatedTodo}
                    className="primaryBtn"
                  >
                    Updated
                  </button>
                </div>
              ) : (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div>
                    <MdDelete
                      className="icon"
                      onClick={() => handleDeletedTodo(index)}
                      title="Delete"
                    />
                    <FaCheck
                      className="check-icon"
                      onClick={() => handleComplete(index)}
                      title="Complete"
                    />
                    <CiEdit
                      className="check-icon"
                      onClick={() => handleEdit(index)}
                      title="Edit"
                    />
                  </div>
                </div>
              )
            )}
          {isCompleteScreen === true &&
            completedTodos.map((item, index) => (
              <div className="todo-list-item" key={index}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>
                    <small>Completed on: {item.completedOn}</small>
                  </p>
                </div>
                <div>
                  <MdDelete
                    className="icon"
                    onClick={() => handleDeletedCompletedTodo(index)}
                    title="Delete"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;
