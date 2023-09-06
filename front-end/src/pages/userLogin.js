import React, { useState, useEffect } from 'react';
import { Form, Button, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import companyLogo from '../image/logoimage.jpg';
import USER from '../image/himage3.jpg';
import './homePage.css'; // Import custom CSS file
import axios from 'axios';
import Lock from '../image/simage2.png';

const UserLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedIsLoggedInUser = localStorage.getItem('isLoggedInUser');
    setIsLoggedInUser(storedIsLoggedInUser === 'true');
  }, []);

  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/Users/login', {
        identifier: identifier,
        Password: password,
      });

      if (response.status === 200) {
        setIsLoggedInUser(true);
        localStorage.setItem('isLoggedInUser', true);
        localStorage.setItem('userData', JSON.stringify(response.data));
        console.log('User logged in successfully');
        // Perform navigation to the service providers
        navigate('/users');
      } else if (response.status === 400) {
        console.error('Bad request:', response.data.error);
      } else {
        console.error('User login failed:', response.data.error);
      }
    } catch (error) {
      console.error('An error occurred during User login:', error);
      message.error('Incorrect User name or password'); // Set the error message
    }

    setLoading(false);
    setIdentifier('');
    setPassword('');
  };


  return (
    <div className="container">
      <div className="header">
        <div className="logo">
          <img src={companyLogo} alt="company logo" />
          <div className="company-name">
            E-payment-system
            <div className="slogan">your trusted online payment system</div>
          </div>
        </div>
      </div>
      <div className="body">
        <Form className="form" onFinish={handleSubmit}>
          <h1>Login</h1>
          <div className="item">
            <label htmlFor="Identifier">
              <img src={USER} alt="login-icon" className="login-icon" />
            </label>
            <input
              type="text"
              name="Email"
              placeholder="User Name or Email Address"
              id="identifier"
              required
              value={identifier}
              onChange={handleIdentifierChange}
            />
          </div>
          <div className="item">
            <label htmlFor="password">
              <img src={Lock} alt="Securityimage" className="security-icon" />
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              id="password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>
          <button className="button" type="primary" htmlType="submit" loading={loading} disabled={loading}>
            Login
          </button>
          <div className="register">
            <p>
              Don't have an account? <Link to="/signup">Create new account</Link>..
            </p>
            <a href="/Users/resetpassword" >
              Forgot Password
            </a>
          </div>
          <div
            id="g_id_onload"
            data-client_id="587101034562-48rg0utnf5bs3cem5mcmqpftmg9urf9t.apps.googleusercontent.com"
            data-callback="handleGoogleSignIn"
          ></div>
          <div className="g_id_signin"></div>
        </Form>
      </div>
    </div>
  );
};

export default UserLogin;