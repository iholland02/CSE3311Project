import React, { useEffect, useState } from 'react';
import { auth, signOut } from '../../firebase'; // Adjust the path based on your actual setup
import { onAuthStateChanged } from 'firebase/auth';
import '../../App.css'; // Keep for common styles
import './Dashboard.css'; // Specific styles for dashboard
import logo from '../../assets/images/logo-color.png'; // Ensure you adjust the path for your logo

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [boards, setBoards] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  // Authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const displayName = currentUser.displayName || 'User'; // Ensure there's a fallback if no display name
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
      setBoards([...boards, { id: crypto.randomUUID(), title: newBoardTitle }]);
      setNewBoardTitle('');
      setIsPopupOpen(false); // Close the popup after creating the board
    }
  };

  // Handle logging out
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="dashboard-container">
      {/* Top header section */}
      <div className="header-container">
        {/* Boardr logo */}
        <img src={logo} alt="Boardr Logo" className="boardr-logo" />
        
        {/* Center text with user's first name */}
        <div className="center-header-text">
          <h1>{firstName}'s Boards</h1>
        </div>

        {/* Create button and log out button */}
        <div className="create-button-container">
          <button className="create-button" onClick={togglePopup}>Create New Board</button>
          <button className="logout-button" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      {/* Slide-in popup form */}
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

      {/* Display all created boards */}
      <div className="board-container">
        {boards.map((board) => (
          <div key={board.id} className="board-card">
            <h3>{board.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
