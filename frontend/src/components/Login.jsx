import React, { useState } from 'react';
import { authApi } from '../services';
import '../styles/login.css';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = isRegister
        ? await authApi.register(username, password)
        : await authApi.login(username, password);

      if (isRegister) {
        setError('Admin registered! Now login.');
        setIsRegister(false);
        setUsername('');
        setPassword('');
      } else {
        localStorage.setItem('token', response.data.token);
        onLogin(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Hostel Management System</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
          <p>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <a onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Login' : 'Register'}
            </a>
          </p>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
