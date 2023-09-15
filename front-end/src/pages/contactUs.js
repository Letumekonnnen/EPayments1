import React from 'react';
import { Link } from 'react-router-dom';
import companyLogo from '../image/logoimage.jpg';
import USER from '../image/himage3.jpg';
import './homePage.css';

function ContactUs() {
  return (
    <div className='container'>
      <div className="overlay-curve"></div>
      <div className='header'>
        <div className='logo'>
          <img src={companyLogo} alt='company logo' />
          <div className='company-name'>
            E-payment-system
            <div className='slogan'>your trusted online payment system</div>
          </div>
        </div>

        <div className='nav'>
          <Link to="/contactUs" className='nav-item'>Contact Us</Link>
          <Link to="/services" className='nav-item'>Services</Link>
          <Link to="/aboutUs" className='nav-item'>About Us</Link>
        </div>

        <div className='login-box'>
          <img src={USER} alt='login-icon' className='login-icon'></img>
          <Link to="/login" className='login'>Log in</Link>
        </div>
      </div>

      <div className='body'>
        <h1>Contact Us</h1>
        <p>For any inquiries or assistance, please reach out to our support team:</p>
        <div className='contact-info'>
          <h3>Email:</h3>
          <p>support@epaymentsystem.com</p>
        </div>
        <div className='contact-info'>
          <h3>Phone:</h3>
          <p>+251-911-23-76-34</p>
        </div>
        <div className='contact-info'>
          <h3>Mailing Address:</h3>
          <p>Bole, Addis Ababa, Ethiopia</p>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;