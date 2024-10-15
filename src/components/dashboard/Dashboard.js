import React, { useEffect, useState } from 'react';
import { auth, signOut } from '../../firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import '../../App.css'; 
import './Dashboard.css'; 
import logo from '../../assets/images/logo-color.png'; 

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [boards, setBoards] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [newSubtask, setNewSubtask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const displayName = currentUser.displayName || 'User'; 
        setFirstName(displayName.split(' ')[0]); // Extract the first name
      } else {
        setUser(null);
        setFirstName('');
      }
    });
    return () => unsubscribe();
  }, []);

  // Toggle the popup visibility
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Handle creating a new board
  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (newBoardTitle) {
      const newBoard = { id: crypto.randomUUID(), title: newBoardTitle, subtasks: [] };
      setBoards([...boards, newBoard]);
      setNewBoardTitle('');
      setIsPopupOpen(false);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };


  // Handle selecting a board to expand
  const handleSelectBoard = (board) => {
    setSelectedBoard(board);
  };

  // Handle adding a subtask
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (newSubtask && newDueDate) {
      const localDate = new Date(newDueDate); // Fix date issue
      const newSubtaskObj = {
        id: crypto.randomUUID(),
        text: newSubtask,
        completed: false,
        dueDate: localDate.toISOString().substring(0, 10), // Store as ISO string without time
      };
      const updatedBoard = {
        ...selectedBoard,
        subtasks: [...selectedBoard.subtasks, newSubtaskObj].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
      };
      setBoards(boards.map(board => board.id === selectedBoard.id ? updatedBoard : board));
      setSelectedBoard(updatedBoard);
      setNewSubtask('');
      setNewDueDate('');
    }
  };

  // Handle marking subtask as completed
  const handleToggleCompleteSubtask = (subtaskId) => {
    const updatedSubtasks = selectedBoard.subtasks.map(subtask => 
      subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
    );
    const updatedBoard = { ...selectedBoard, subtasks: updatedSubtasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)) };
    setBoards(boards.map(board => board.id === selectedBoard.id ? updatedBoard : board));
    setSelectedBoard(updatedBoard);
  };

  // Handle deleting a subtask
  const handleDeleteSubtask = (subtaskId) => {
    const updatedBoard = {
      ...selectedBoard,
      subtasks: selectedBoard.subtasks.filter(subtask => subtask.id !== subtaskId),
    };
    setBoards(boards.map(board => board.id === selectedBoard.id ? updatedBoard : board));
    setSelectedBoard(updatedBoard);
  };

  // Handle deleting a board
  const handleDeleteBoard = () => {
    setBoards(boards.filter(board => board.id !== selectedBoard.id));
    setSelectedBoard(null);
  };

  // Handle closing the board without deleting it
  const handleCloseBoard = () => {
    setSelectedBoard(null);
  };

  // Find the next due subtask for a board
  const findNextDueSubtask = (subtasks) => {
    const upcomingSubtask = subtasks.find(subtask => !subtask.completed);
    if (upcomingSubtask) {
      const dueDateFormatted = new Date(upcomingSubtask.dueDate).toLocaleDateString('en-US');
      const today = new Date().toISOString().substring(0, 10);
      if (upcomingSubtask.dueDate < today) {
        return `${upcomingSubtask.text} overdue!`;
      } else {
        return `Next due: ${upcomingSubtask.text} on ${dueDateFormatted}`;
      }
    }
    return 'No upcoming subtasks';
  };

  return (
    <div className="dashboard-container">
      <div className="header-container">
        <img src={logo} alt="Boardr Logo" className="boardr-logo" />
        <div className="center-header-text">
          <h1>{firstName}'s Boards</h1>
        </div>
        <div className="create-button-container">
          <button className="create-button" onClick={togglePopup}>Create New Board</button>
          <button className="logout-button" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateBoard} className="popup-form">
              <input
                type="text"
                placeholder="Project/Assignment Title"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                required
              />
              <button type="submit" className="popup-submit-btn">Create</button>
              <button type="button" className="popup-close-btn" onClick={togglePopup}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <div className="board-container">
        {boards.map((board) => (
          <div key={board.id} className="board-card" onClick={() => handleSelectBoard(board)}>
            <h3>{board.title}</h3>
            <p>{findNextDueSubtask(board.subtasks)}</p>
          </div>
        ))}
      </div>

      {selectedBoard && (
        <div className="expanded-board">
          <h2>{selectedBoard.title}</h2>
          <form onSubmit={handleAddSubtask} className="subtask-form">
            <input
              type="text"
              placeholder="Add a subtask"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              required
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              required
            />
            <button type="submit" className="add-subtask-btn">+</button>
          </form>
          <ul className="subtask-list">
            {selectedBoard.subtasks.map((subtask) => (
              <li key={subtask.id} className={subtask.completed ? 'completed' : ''}>
                <span>{subtask.text}</span>
                <span>{new Date(subtask.dueDate).toLocaleDateString('en-US')}</span>
                <input type="checkbox" checked={subtask.completed} onChange={() => handleToggleCompleteSubtask(subtask.id)} />
                <i className="fas fa-trash" onClick={() => handleDeleteSubtask(subtask.id)}></i>
              </li>
            ))}
          </ul>
          <button className="close-board-btn" onClick={handleCloseBoard}>Close Board</button>
          <button className="delete-board-btn" onClick={handleDeleteBoard}>Delete Board</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
