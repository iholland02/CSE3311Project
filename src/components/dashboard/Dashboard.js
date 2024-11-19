import React, { useEffect, useState } from "react";
import { auth, signOut } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import "../../App.css";
import "./Dashboard.css";
import logo from "../../assets/images/logo-color.png";
import CitationGenerator from "./CitationGenerator";

const db = getFirestore();

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [boards, setBoards] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCardTypePopupOpen, setIsCardTypePopupOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [selectedCardType, setSelectedCardType] = useState("Blank");
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isCitationGeneratorOpen, setIsCitationGeneratorOpen] = useState(false);

  // Fetch boards on user login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const displayName = currentUser.displayName || "User";
        setFirstName(displayName.split(" ")[0]);
        await fetchBoards(currentUser.uid);
      } else {
        setUser(null);
        setFirstName("");
        setBoards([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchBoards = async (uid) => {
    try {
      const userRef = doc(db, "Users", uid);
      const boardCollection = collection(userRef, "boards");
      const boardDocs = await getDocs(boardCollection);
      const userBoards = boardDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBoards(userBoards);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const toggleCardTypePopup = () => setIsCardTypePopupOpen(!isCardTypePopupOpen);

  const handleCardTypeSelect = (type) => {
    setSelectedCardType(type);
    toggleCardTypePopup();
    togglePopup();
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (newBoardTitle && user) {
      const newBoard = {
        title: newBoardTitle,
        subtasks: [],
        cardType: selectedCardType,
      };
      try {
        const userRef = doc(db, "Users", user.uid);
        const boardRef = doc(collection(userRef, "boards"));
        await setDoc(boardRef, newBoard);

        setBoards([...boards, { id: boardRef.id, ...newBoard }]);
        setNewBoardTitle("");
        setIsPopupOpen(false);
      } catch (error) {
        console.error("Error creating board:", error);
      }
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (newSubtask && user) {
      const newSubtaskObj = {
        id: crypto.randomUUID(),
        text: newSubtask,
        completed: false,
        dueDate: selectedBoard.cardType === "Schedule" ? new Date(newDueDate).toISOString().substring(0, 10) : null,
      };

      const updatedBoard = {
        ...selectedBoard,
        subtasks: [...(selectedBoard.subtasks || []), newSubtaskObj],
      };

      const boardRef = doc(db, `Users/${user.uid}/boards/${selectedBoard.id}`);
      await setDoc(boardRef, updatedBoard);

      setBoards(
        boards.map((board) => (board.id === selectedBoard.id ? updatedBoard : board))
      );
      setSelectedBoard(updatedBoard);
      setNewSubtask("");
      setNewDueDate("");
    }
  };

  const handleAddCitation = async (citation) => {
    const newCitation = {
      id: crypto.randomUUID(),
      text: citation,
    };

    const updatedBoard = {
      ...selectedBoard,
      subtasks: [...(selectedBoard.subtasks || []), newCitation],
    };

    const boardRef = doc(db, `Users/${user.uid}/boards/${selectedBoard.id}`);
    await setDoc(boardRef, updatedBoard);

    setBoards(
      boards.map((board) => (board.id === selectedBoard.id ? updatedBoard : board))
    );
    setSelectedBoard(updatedBoard);
  };

  const handleDeleteSubtask = async (subtaskId) => {
    const updatedSubtasks = (selectedBoard.subtasks || []).filter(
      (subtask) => subtask.id !== subtaskId
    );

    const updatedBoard = { ...selectedBoard, subtasks: updatedSubtasks };

    const boardRef = doc(db, `Users/${user.uid}/boards/${selectedBoard.id}`);
    await setDoc(boardRef, updatedBoard);

    setBoards(
      boards.map((board) => (board.id === selectedBoard.id ? updatedBoard : board))
    );
    setSelectedBoard(updatedBoard);
  };

  const handleToggleCompleteSubtask = async (subtaskId) => {
    const updatedSubtasks = (selectedBoard.subtasks || []).map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    const updatedBoard = { ...selectedBoard, subtasks: updatedSubtasks };

    const boardRef = doc(db, `Users/${user.uid}/boards/${selectedBoard.id}`);
    await setDoc(boardRef, updatedBoard);

    setBoards(
      boards.map((board) => (board.id === selectedBoard.id ? updatedBoard : board))
    );
    setSelectedBoard(updatedBoard);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => console.log("User signed out"))
      .catch((error) => console.error("Error signing out:", error));
  };

  return (
    <div className={`dashboard-container ${selectedBoard ? "blur-background" : ""}`}>
      <div className="header-container">
        <img src={logo} alt="Boardr Logo" className="boardr-logo" />
        <div className="center-header-text">
          <h1>{firstName}'s Boards</h1>
        </div>
        <div className="create-button-container">
          <button className="create-button" onClick={toggleCardTypePopup}>
            Create New Board
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      {isCardTypePopupOpen && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Select Card Type</h2>
            <button onClick={() => handleCardTypeSelect("Blank")}>Blank</button>
            <button onClick={() => handleCardTypeSelect("Schedule")}>Schedule</button>
            <button onClick={() => handleCardTypeSelect("Citation")}>Citation</button>
            <button onClick={toggleCardTypePopup}>Cancel</button>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateBoard}>
              <input
                type="text"
                placeholder="Project/Assignment Title"
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                required
              />
              <button type="submit" className="popup-submit-btn">
                Create
              </button>
              <button type="button" onClick={togglePopup}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="board-container">
        {boards.map((board) => (
          <div
            key={board.id}
            className="board-card"
            onClick={() => setSelectedBoard(board)}
          >
            <h3>{board.title}</h3>
          </div>
        ))}
      </div>

      {selectedBoard && (
        <div className="expanded-board">
          <h2>{selectedBoard.title}</h2>
          <div>
            <form onSubmit={handleAddSubtask} className="subtask-form">
              <input
                type="text"
                placeholder="Add an item"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                required
              />
              {selectedBoard.cardType === "Schedule" && (
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  required
                />
              )}
              <button type="submit">Add</button>
            </form>
            <ul className="subtask-list">
              {(selectedBoard.subtasks || []).map((subtask) => (
                <li key={subtask.id}>
                  <span
                    style={{
                      textDecoration: subtask.completed ? "line-through" : "none",
                    }}
                  >
                    {subtask.text}{" "}
                    {subtask.dueDate && <span>({subtask.dueDate})</span>}
                  </span>
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleToggleCompleteSubtask(subtask.id)}
                  />
                  <button onClick={() => handleDeleteSubtask(subtask.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {selectedBoard.cardType === "Citation" && (
            <div>
              <button
                className="citation-button"
                onClick={() => setIsCitationGeneratorOpen(!isCitationGeneratorOpen)}
              >
                {isCitationGeneratorOpen ? "Close Citation Generator" : "Create Citation"}
              </button>
              {isCitationGeneratorOpen && (
                <CitationGenerator onCitationCopy={handleAddCitation} />
              )}
            </div>
          )}
          <button className="close-board-btn" onClick={() => setSelectedBoard(null)}>
            Close Board
          </button>
          <button
            className="delete-board-btn"
            onClick={async () => {
              await deleteDoc(doc(db, `Users/${user.uid}/boards/${selectedBoard.id}`));
              setBoards(boards.filter((board) => board.id !== selectedBoard.id));
              setSelectedBoard(null);
            }}
          >
            Delete Board
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
