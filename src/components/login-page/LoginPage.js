import React from 'react';
import { auth, provider, signInWithPopup } from '../../firebase';
import logo from '../../assets/images/logo-color.png'; // Update with your new logo file
import './LoginPage.css';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('User signed in:', result.user);
      })
      .catch((error) => {
        console.error('Error logging in:', error);
      });
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <img src={logo} alt="Boardr Logo" className="login-logo" />
      </header>
      <div className="login-content">
        <h1 className="login-title">Welcome to Your App</h1>
        <p className="login-subtitle">Blueprint your next project, the smart way.</p>
        <button onClick={handleGoogleLogin} className="login-button">
          Sign In with Google
        </button>
      </div>
      <footer className="login-footer">
        <p>Transform your ideas into reality.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
