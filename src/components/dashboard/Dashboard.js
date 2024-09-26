import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';  // Adjust based on your actual path
import { onAuthStateChanged } from 'firebase/auth';
import "../../App.css"; // Keep for common styles
import "./Dashboard.css"; // Specific styles for dashboard

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState([{ id: crypto.randomUUID(), taskTitle: "Example", subTask: [] }]);
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
    <div className="dashboard-container">
      {/* Create button and dropdown contents */}
      <div className="dropdown">
        <button className="dropbtn">Create</button>
        <div className="dropdown-content">
          <button onClick={() => OpenForm("CheckList-form")}>Check List</button>
          <button>Date</button>
          <button>More</button>
        </div>
      </div>

      {/* Form for entering main task */}
      <div className="form-popup" id="CheckList-form">
        <form onSubmit={handleSubmit} className="form-container">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            type="text"
            id="taskMain"
            placeholder="MAIN TASK"
          ></input>
          <button className="close-btn" onClick={() => OpenForm("createSub")}>
            Create
          </button>
        </form>
      </div>

      {/* Form for entering sub-tasks */}
      <div className="form-popup" id="createSub">
        <h2>{title}</h2> {/* Display the MAIN TASK name */}
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => toggleTodo(todo.id, e.target.checked)}
              />
              {todo.completed ? <del>{todo.title}</del> : todo.title}
            </label>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
        <form onSubmit={createSubTask} className="form-container">
          <input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            type="text"
            id="item"
            placeholder="SubTask"
          />
          <button className="close-btn">Add</button>
          <button className="close-btn" onClick={() => newTask()}>
            Done
          </button>
        </form>
      </div>

      {/* Display all tasks */}
      {task.map((taskInfo) => (
        <ul key={taskInfo.taskTitle}>
          <div className="task-display" id="displayTask">
            <h2>{taskInfo.taskTitle}</h2>
            {taskInfo.subTask.map((sub) => (
              <li key={sub.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={(e) => toggleTask(taskInfo.id, sub.id, e.target.checked)}
                  />
                  {sub.completed ? <del>{sub.text}</del> : sub.text}
                </label>
              </li>
            ))}
          </div>
        </ul>
      ))}
    </div>
  );
};

export default Dashboard;
