import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <button onClick={() => signOut(auth)} className="signout-button">Sign Out</button>
    </div>
  );
};

export default Dashboard;
