import React, { useEffect, useState } from "react";
import { auth } from "../../firebase"; // Adjust based on your actual path
import { onAuthStateChanged } from "firebase/auth";
import "../../App.css"; // Keep for common styles
import "./Dashboard.css"; // Specific styles for dashboard
import Topmenu from "./topmenu.js";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState([]);
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [newItem, setNewItem] = useState("");

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? currentUser : null);
    });
    return () => unsubscribe();
  }, []);

  // Open and close forms based on id name
  function OpenForm(id) {
    document.getElementById(id).style.display = "block";
  }

  function CloseForm(id) {
    document.getElementById(id).style.display = "none";
  }

  // Setting the main title of the task
  function handleSubmit(e) {
    e.preventDefault();
    setTitle(() => document.getElementById("taskMain").value);
    setNewItem(""); // Clear text-box
    CloseForm("CheckList-form");
  }

  // Populate the todos[] array to temporarily store subTask values
  function createSubTask(e) {
    e.preventDefault();
    setTodos((currentTodos) => {
      if (newItem !== "") {
        return [
          ...currentTodos,
          { id: crypto.randomUUID(), title: newItem, completed: false },
        ];
      }
      return currentTodos;
    });
    setNewItem(""); // Clear text-box
  }

  // Adding a new task to task[]
  function newTask() {
    const subTask = todos.map((todo) => ({
      id: crypto.randomUUID(),
      text: todo.title,
      completed: false,
    }));
    setTask([
      ...task,
      { id: crypto.randomUUID(), taskTitle: title, subTask: subTask },
    ]);
    CloseForm("createSub");
    setTodos([]); // Reset the todos[] after copying data to task[]
  }

  // Toggle task completion
  function toggleTodo(id, completed) {
    setTodos((currentTodos) => {
      return currentTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed };
        }
        return todo;
      });
    });
  }

  // Toggle completion for tasks on the dashboard
  function toggleTask(tId, id, completed) {
    setTask((temp) => {
      return temp.map((ttitle) => {
        if (ttitle.id === tId) {
          ttitle.subTask.map((sub) => {
            if (sub.id === id) {
              sub.completed = completed;
            }
            return sub;
          });
        }
        return ttitle;
      });
    });
  }

  // Delete todos during creation
  function deleteTodo(id) {
    setTodos((currentTodos) => {
      return currentTodos.filter((todo) => todo.id !== id);
    });
  }

  return (
    <>
      <Topmenu />
      <div className="dash-content">
        <div className="relative lg:items-center lg:justify-between w-[100%]">
          {/*create button and dropdown contents */}
          <section className="inline-block relative justify-center pt-[20px] pb-[30px]">
            <div className="dropdown">
              <button className="dropbtn">Create</button>
              <div className="dropdown-content">
                <button onClick={() => OpenForm("CheckList-form")}>
                  Check List
                </button>
                <button>Date</button>
                <button>Description</button>
                <button>Citation</button>
              </div>
            </div>
          </section>

          {/* Form for entering main task */}
          <div className="form-popup" id="CheckList-form">
            <form onSubmit={handleSubmit} className="form-container">
              <input
                className="text-center rounded-lg block mb-2 text-sm font-medium text-black"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                type="text"
                id="taskMain"
                placeholder="MAIN TASK"
              ></input>
              <button
                className="inline-block rounded-full border border-gray-3 px-7 py-2 text-white font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-gray dark:border-dark-3 dark:text-dark-6 m-2"
                onClick={() => OpenForm("createSub")}
              >
                Create
              </button>
              <button
                className="inline-block rounded-full border border-gray-3 px-7 py-2 text-white font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-dark-6 m-2"
                onClick={() => CloseForm("CheckList-form")}
              >
                Cancel
              </button>
            </form>
          </div>

          {/* Form for entering sub-tasks */}
          <div className="form-popup" id="createSub">
            <div className="text-[30px] rounded text-white bg-[#2a3990] p-2">
              {title}
            </div>{" "}
            {/*display the MAIN TASK name */}
            <div>
              {todos.map((todo) => {
                return (
                  <li key={todo.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                      />

                      {todo.completed ? <del>{todo.title}</del> : todo.title}
                      {/*display the subtask after it is added to the list*/}
                    </label>
                    <button
                      className="inline-block rounded-full border border-gray-3 px-3 py-2 text-white text-xs font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-dark-6 m-2 "
                      onClick={() => deleteTodo(todo.id)}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </div>
            <form onSubmit={createSubTask} className="form-container">
              <input
                className="text-center rounded-lg block mb-2 text-md font-medium text-gray-900 dark:text-black border-black border-8"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                type="text"
                id="item"
                placeholder="Add subtask to list"
              />
              <button className="inline-block rounded-full border border-gray-3 px-7 py-2 text-white font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-dark-6 m-2">
                Add
              </button>{" "}
              {/*clciking this add button will add subTask to the screen and temporarily store the value in the todos[] */}
              <button
                className="inline-block rounded-full border border-gray-3 px-7 py-2 text-white font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-dark-6 m-2"
                onClick={() => newTask()}
              >
                {" "}
                {/* clicking this will call our newTask function */}
                Done
              </button>
            </form>
          </div>

          {/* Display all tasks */}
          <div className="fixed grid grid-cols-4 gap-4 p-5">
            {task.map((taskInfo) => {
              return (
                <>
                  <ul>
                    <div
                      className="mb-10 overflow-hidden border border-black border-2 rounded-lg bg-primary text-black p-6 shadow-1 duration-300 hover:shadow-3 dark:bg-dark-2 dark:shadow-card dark:hover:shadow-3"
                      id="displayTask"
                    >
                      <div className="text-[30px] font-bold">
                        {taskInfo.taskTitle}
                      </div>
                      <div className="pt-5 pb-8 text-left">
                        {taskInfo.subTask.map((sub) => {
                          return (
                            <li key={sub.id}>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={sub.completed}
                                  onChange={(e) =>
                                    toggleTask(
                                      taskInfo.id,
                                      sub.id,
                                      e.target.checked
                                    )
                                  }
                                />
                                {sub.completed ? (
                                  <del>{sub.text}</del>
                                ) : (
                                  sub.text
                                )}
                              </label>
                            </li>
                          );
                        })}
                      </div>
                      <button
                        className="inline-block rounded-full border border-gray-3 px-7 py-2 text-white font-medium text-body-color transition hover:border-primary hover:bg-primary hover:text-white dark:border-dark-3 dark:text-dark-6"
                        id="edit-btn"
                      >
                        Edit
                      </button>
                    </div>
                  </ul>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
