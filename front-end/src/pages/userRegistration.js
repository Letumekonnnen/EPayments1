import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import companyLogo from '../image/logoimage.jpg';
import { Link, useNavigate } from 'react-router-dom';

import { Select } from 'antd';



const RegistrationForm = () => {


  const { Option } = Select;
  const [counter, setCounter] = useState(1);

  const getNextUserID = () => {
    const timestamp = Date.now().toString(); // Get the current timestamp
    const randomNumber = Math.floor(Math.random() * 10000).toString(); // Generate a random number between 0 and 9999
    return `P${timestamp}${randomNumber}`;
  };

  const incrementCounter = () => {
    setCounter((prevCounter) => prevCounter + 1);
  };

  const [formData, setFormData] = useState({
    UserID: getNextUserID(),
    FirstName: '',
    LastName: '',
    Gender: 'female',
    UserName: '',
    Password: '',
    ConfirmPassword: '',
    Email: '',
    PhoneNumber: '+251',
    Address: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {};


    if (!formData.FirstName) {
      newErrors.FirstName = 'First Name is required';
    } else if (!/^[A-Za-z]+$/.test(formData.FirstName)) {
      newErrors.FirstName = 'First Name should only contain letters';
    }

    if (!formData.LastName) {
      newErrors.LastName = 'Last Name is required';
    } else if (!/^[A-Za-z]+$/.test(formData.LasttName)) {
      newErrors.LastName = 'Last Name should only contain letters';
    }

    if (!formData.Gender) {
      newErrors.Gender = 'Gender is required';
    }

    if (!formData.UserName) {
      newErrors.UserName = 'User name is required';
    }

    if (!formData.Password) {
      newErrors.Password = 'Password is required';
    }

    if (!formData.ConfirmPassword) {
      newErrors.ConfirmPassword = 'Confirm password is required';
    } else if (formData.Password !== formData.ConfirmPassword) {
      newErrors.ConfirmPassword = 'Passwords do not match';
    }

    if (!formData.Email) {
      newErrors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = 'Email is invalid';
    }

    if (!formData.Address) {
      newErrors.Address = 'Address is required';
    }

    if (!formData.PhoneNumber) {
      newErrors.PhoneNumber = 'Phone number is required';

    } else if (!/^\+[0-9\s-()]+$/.test(formData.PhoneNumber)) {
      newErrors.PhoneNumber = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if there are no errors
  };

  const checkUserExists = async (email) => {
    try {
      const response = await axios.get('http://localhost:3000/Users');
      const users = response.data;
      const userExists = users.some((user) => user.Email === email);
      return userExists;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw error;
    }
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const userExists = await checkUserExists(formData.Email);
        if (userExists) {
          setErrors({ Email: 'User already exists' });
          console.log('Existing user:', formData.Email);
        } else {
          const formDataToSend = new FormData();
          formDataToSend.append('UserID', formData.UserID);
          formDataToSend.append('FirstName', formData.FirstName);
          formDataToSend.append('LastName', formData.LastName);
          formDataToSend.append('Gender', formData.Gender);
          formDataToSend.append('UserName', formData.UserName);
          formDataToSend.append('Password', formData.Password);
          formDataToSend.append('PhoneNumber', formData.PhoneNumber);
          formDataToSend.append('Email', formData.Email);
          formDataToSend.append('Address', formData.Address);

          await axios.post('http://localhost:3000/Users', formDataToSend);


          // Perform navigation to the service providers
          navigate('/serviceProviders');
          // Display success message using Toastify
          toast.success('Registered successfully!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
          console.log('registration successful');
          setIsSubmitted(true);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

      <div className="user-body"style={{marginTop: '15px'}}>
        <ToastContainer />

        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="title">Register</div>
            <div className="user-detail">
              <div className="item">
                <label className="user-input">UserID:</label>
                <input
                  type="text"
                  name="UserID"
                  className="input-field"
                  value={formData.UserID}
                  onChange={handleChange}
                  disabled
                />
              </div>
              <div className="item">
                <label className="user-input">First Name:</label>
                <input
                  type="text"
                  name="FirstName"
                  className="input-field"
                  value={formData.FirstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
                {errors.FirstName && <span>{errors.FirstName}</span>}
              </div>
              <div className="item">
                <label className="user-input">Last Name:</label>
                <input
                  type="text"
                  name="LastName"
                  className="input-field"
                  value={formData.LastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
                {errors.LastName && <span>{errors.LastName}</span>}
              </div>

              <div className="item">
              <div className="select-item">
                <label className="gender-title" value={formData.Gender}>
                  Gender:
                </label>
                <div className="category">
                  <select type="dropdown" name="Gender" onSelect={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>

                  {errors.Gender && <span className="error">{errors.Gender}</span>}
                </div>
              </div>
              </div>

              <div className="item">
                <label className="user-input">User Name:</label>
                <input
                  type="text"
                  name="UserName"
                  className="input-field"
                  value={formData.UserName}
                  onChange={handleChange}
                  placeholder="Enter your user name"
                />
                {errors.UserName && <span>{errors.UserName}</span>}
              </div>
              <div className="item">
                <label className="user-input">Password:</label>
                <input
                  type="password"
                  name="Password"
                  className="input-field"
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                {errors.Password && <span>{errors.Password}</span>}
              </div>
              <div className="item">
                <label className="user-input">Confirm Password:</label>
                <input
                  type="password"
                  name="ConfirmPassword"
                  className="input-field"
                  value={formData.ConfirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
                {errors.ConfirmPassword && <span>{errors.ConfirmPassword}</span>}
              </div>
              <div className="item">
                <label className="user-input">Email:<br/> </label>
                <input
                  type="Email"
                  name="Email"
                  className="input-field"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.Email && <span>{errors.Email}</span>}
              </div>
              <div className="item">
                <label className="user-input">Phone Number:</label>
                <input
                  type="tel"
                  name="PhoneNumber"
                  className="input-field"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                {errors.PhoneNumber && <span>{errors.PhoneNumber}</span>}
              </div>
              <div className="item">
                <label className="user-input">Address:</label>
                <input
                  type="text"
                  name="Address"
                  className="input-field"
                  value={formData.Address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
                {errors.Address && <span>{errors.Address}</span>}
              </div>
            </div>
            <button className="button" type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
          <div className="login-link" style={{ marginTop: '20px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ textDecoration: 'underline' }}>
              Login here
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
};
export default RegistrationForm;