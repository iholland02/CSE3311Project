// src/components/LoginPage/LoginPage.js
import React from 'react';
import { auth, provider, signInWithPopup } from '../../firebase';
import logo from '../../assets/images/logo-color.png';
import './LoginPage.css';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // User logged in, handle redirection or state update here
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <img src={logo} alt="Logo" className="login-logo" />
      </header>
      <div className="login-content">
        <h1>Welcome to Your App</h1>
        <p>Enhance your experience, blueprint your next project.</p>
        <button onClick={handleGoogleLogin} className="login-button">Sign In with Google</button>
      </div>
    </div>
  );
};

export default LoginPage;
