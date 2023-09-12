import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [Email, setEmail] = useState(localStorage.getItem('Email'));
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { token } = useParams();

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const token = window.location.hash.substr(2);
      const response = await axios.post('http://localhost:3000/Users/updatePasswordWithToken', {
        Email: Email, 
        Password: password,
        token: token,
      });

      if (response.status === 200) {
        setMessage('Password updated successfully');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to update password');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: '0 auto' }}>
        <div>
          <label htmlFor="password" style={{ marginBottom: '0.5rem' }}>New Password:</label>
          <input type="password" id="password" value={password} onChange={handleChangePassword} required style={{ padding: '0.5rem', marginBottom: '1rem' }} />
        </div>
        <div>
          <label htmlFor="confirmPassword" style={{ marginBottom: '0.5rem' }}>Confirm Password:</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={handleChangeConfirmPassword} required style={{ padding: '0.5rem', marginBottom: '1rem' }} />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdatePassword;