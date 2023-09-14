import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './homePage.css';
import axios from 'axios';
import companyLogo from '../image/logoimage.jpg';

const ServiceProvidersDetails = () => {
  const navigate = useNavigate();
  const [serviceProviderData, setServiceProviderData] = useState([]);

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const fetchServiceProviders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/serviceproviders');
      setServiceProviderData(response.data);
    } catch (error) {
      message.error('Failed to fetch service providers.');
    }
  };

  const handleServiceProviderClick = (serviceProvider) => {
    console.log('Selected service provider:', serviceProvider);
    console.log(serviceProvider.serviceProviderBIN);
    localStorage.setItem('serviceProviderBIN', serviceProvider.serviceProviderBIN);
    console.log(localStorage.getItem('serviceProviderBIN'));
    navigate('/serviceNumber'); // Navigate to 'payment' page
  };

  return (
    
   
      <div className='container'>
    <div className='header'>
      <div className='logo'>
        <img src={companyLogo} alt='company logo' />
        <div className='company-name'>
          E-payment-system
          <div className='slogan'>your trusted online payment system</div>
        </div>
      </div>
</div>
    <div className='class'>
    <h1 className='list-header'>Choose the Service Providers you want to make pay </h1>
      <ul>
        {serviceProviderData.map((serviceProvider) => (
          <li key={serviceProvider.id}>
            <button type="primary" className='button' onClick={() => handleServiceProviderClick(serviceProvider)}>
              {serviceProvider.serviceProviderName}
            </button>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default ServiceProvidersDetails;