import React, { useState } from 'react';
import axios from 'axios';

const ResetPasswordForm = () => {
  const [Email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/Users/requestPasswordReset', { Email: Email });
      setMessage(response.data.message);
      localStorage.setItem('Email',Email);
      console.log(Email);
      console.log(localStorage.getItem('Email'));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label htmlFor="Email" style={labelStyle}>Email:</label>
          <input type="Email" id="Email" value={Email} onChange={handleChange} required style={inputStyle} />
        </div>
        <button type="submit" style={buttonStyle}>Send Email</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPasswordForm;

// Inline styles
const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '300px',
  margin: '0 auto',
};

const labelStyle = {
  marginBottom: '0.5rem',
};

const inputStyle = {
  padding: '0.5rem',
  marginBottom: '1rem',
  marginTop: '12rem',
};

const buttonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',

};