import React, { useState } from 'react';
import { Form, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
import './style.css'; // Import custom CSS file



const AdminLogin = () => {
  const [Identifier, setIdentifier] = useState('');
  const [Password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminData, setAdminData] = useState([]);

  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: Identifier, Password: Password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        if (data && data.token) {
          localStorage.setItem('adminToken', data.token);
          localStorage.setItem('adminData', JSON.stringify(data.user)); // Store adminData as JSON
          setIsLoggedIn(true);
          console.log('Admin logged in successfully');
          console.log(`${data.token},${data.user.id}`);
          console.log(localStorage.getItem('adminData'));
          navigate(`/admin/dashboard/${data.user.id}`);
        } else {
          message.error('server error');
          console.error('Invalid server response:', data);
        }
      } else {
        message.error('Admin login failed');
        message.error('insert valid UserName and Password');
        console.error('Admin login failed:', data.error);
      }
    } catch (error) {
      message.error('An error occurred during admin login');
      console.error('An error occurred during admin login:', error);
    }
  
    setLoading(false);
    setIdentifier('');
    setPassword('');
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <Form className="form" onFinish={handleSubmit}>
        <label htmlFor="identifier">
          <UserOutlined className="icon" />
        </label>
        <input
          type="text"
          name="identifier"
          placeholder="Username or Email"
          id="identifier"
          required
          value={Identifier}
          onChange={handleIdentifierChange}
        />
        <label htmlFor="password">
          <LockOutlined className="icon" />
        </label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          id="password"
          required
          value={Password}
          onChange={handlePasswordChange}
        />
        <Button className="button" type="primary" htmlType="submit" loading={loading} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
    </div>
  );
};

export default AdminLogin;



