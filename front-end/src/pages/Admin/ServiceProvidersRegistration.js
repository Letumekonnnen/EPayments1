import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Button, message, Form, Input, Upload, Modal } from 'antd';
import Dashboard from './Dashboard';


const ServiceProviderRegistrationForm = () => {
  const [form] = Form.useForm();
  const [selectedMenu, setSelectedMenu] = useState(['4']);
  const [formData, setFormData] = useState({
    serviceProviderBIN: '',
    serviceProviderName: '',
    servicesOffered: '',
    BankName: '',
    BankAccountNumber: '',
    phoneNumber: '',
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [serviceProviderAuthorizationLetterUrl, setServiceProviderAuthorizationLetterUrl] = useState();

  useEffect(() => {
    localStorage.setItem("selectedMenu", selectedMenu);
  }, [selectedMenu]);
  

  const validateForm = () => {
    const newErrors = {};

    if (!formData.serviceProviderBIN) {
      newErrors.serviceProviderBIN = 'Business Identification Number is required';
    }

    if (!formData.serviceProviderName) {
      newErrors.serviceProviderName = 'ServiceProviderName is required';
    }

    if (!formData.servicesOffered) {
      newErrors.servicesOffered = 'Services Offered is required';
    }

    if (!formData.BankName) {
      newErrors.BankName = 'Bank Name is required';
    }

    if (!formData.BankAccountNumber) {
      newErrors.BankAccountNumber = 'Bank Account Number is required';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\+?\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const url = URL.createObjectURL(selectedFile);
    setServiceProviderAuthorizationLetterUrl(url);
    setFile(selectedFile);
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('serviceProviderBIN', formData.serviceProviderBIN);
        formDataToSend.append('serviceProviderName', formData.serviceProviderName);
        formDataToSend.append('servicesOffered', formData.servicesOffered);
        formDataToSend.append('BankName', formData.BankName);
        formDataToSend.append('BankAccountNumber', formData.BankAccountNumber);
        formDataToSend.append('phoneNumber', formData.phoneNumber);
        formDataToSend.append('serviceProviderAuthorizationLetter', file);

        await axios.post('http://localhost:3000/serviceproviders', formDataToSend);
        message.success('Service provider registered successfully!');
        console.log('Service provider registered successfully!');
        form.resetFields();
        window.location.href = window.location.href;
      } catch (error) {
        message.error('Error submitting form:')
        console.error('Error submitting form:', error);
        // Handle the error, show an error message, etc.
      }
    }
  };

  return (
    <Dashboard selectedMenu={selectedMenu}
      content={
        <Form name="serviceProviderRegistrationForm" onFinish={handleSubmit}>
          <h1>Service provider Registration</h1>

          <Form.Item
            label="Business Identification Number"
            validateStatus={errors.serviceProviderBIN && 'error'}
            help={errors.serviceProviderBIN}
          >
            <Input name="serviceProviderBIN" onChange={handleChange} />
          </Form.Item>

          <Form.Item
            label="Service Provider Name"
            validateStatus={errors.serviceProviderName && 'error'}
            help={errors.serviceProviderName}
          >
            <Input name="serviceProviderName" onChange={handleChange} />
          </Form.Item>

          <Form.Item
            label="Services Offered"
            validateStatus={errors.servicesOffered && 'error'}
            help={errors.servicesOffered}
          >
            <Input name="servicesOffered" onChange={handleChange} />
          </Form.Item>

          <Form.Item
            label="Bank Name"
            validateStatus={errors.BankName && 'error'}
            help={errors.BankName}
          >
            <Input name="BankName" onChange={handleChange} />
          </Form.Item>

          <Form.Item
            label="Bank Account Number"
            validateStatus={errors.BankAccountNumber && 'error'}
            help={errors.BankAccountNumber}
          >
            <Input name="BankAccountNumber" onChange={handleChange} />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            validateStatus={errors.phoneNumber && 'error'}
            help={errors.phoneNumber}
          >
            <Input name="phoneNumber" onChange={handleChange} />
          </Form.Item>

          <Form.Item >
          <label htmlFor="serviceProviderAuthorizationLetter">Authorization Letter:</label>
              <input
                type="file"
                id="serviceProvider"
                accept=".jpeg, .jpg, .png, .gif"
                onChange={handleFileChange}
              />
              {serviceProviderAuthorizationLetterUrl && (
                <img src={serviceProviderAuthorizationLetterUrl} alt="Auth Letter" style={{ width: '200px' }} />
              )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
            Register
                </Button>
              </Form.Item>
            </Form>
        } />
  );
};

export default ServiceProviderRegistrationForm;