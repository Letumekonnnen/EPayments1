import React from 'react';
import './homePage.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import companyLogo from '../image/logoimage.jpg';
import BodyPhoto from '../image/pimage1.jpg';
import USER from '../image/himage3.jpg';
import Bill from '../image/bimage2.png';
import Security from '../image/simage.png';
import Cash from '../image/mimage.png';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from 'antd';
import { Layout, Button, Input, Modal, message } from 'antd';
import {
  LogoutOutlined,
  HomeOutlined
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;


function HomePage() {
  
  
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState({});
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isSiderCollapsed, setIsSiderCollapsed] = useState();
  const { adminId } = useParams();
  const [isLoggedInUser, setIsLoggedInUser] = useState();
  const [formData, setFormData] = useState({
    UserID: '',
    FirstName: '',
    LastName: '',
    Gender: '',
    UserName: '',
    Email: '',
    PhoneNumber: '',
    Address: '',
    Role: 'User',
    ProfilePicture: null,
  });
  const [selectedMenu, setSelectedMenu] = useState(localStorage.getItem("selectedMenu") || "1");
      
  const handleMenuSelect = ({ key }) => {
    setSelectedMenu([key]);
  };

  useEffect(() => {
    localStorage.setItem("selectedMenu", selectedMenu);
    const userDataString = localStorage.getItem('userData');
    const userData = JSON.parse(userDataString);
    console.log(userData);
  
    if (userData !== null) {
      setIsLoggedInUser(localStorage.getItem('isLoggedInUser') || false);
      setUserData(userData.user);
      console.log(userData.user);
      const pp = userData.user;
      console.log(pp.ProfilePicture);
  
      if (userData.user.ProfilePicture !== null) {
        setProfilePictureUrl(`http://localhost:3001/${userData.user.ProfilePicture}`);
      }
  
      try {
        setFormData(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
        message.error('Error parsing user data');
        // Handle error while parsing the data from localStorage
      }
    }
  }, [selectedMenu]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setProfilePictureUrl(url);
    setFormData((prevData) => ({
      ...prevData,
      ProfilePicture: file,
    }));
  };

  const handleEdit = (user) => {
    form.setFieldsValue(user);
    setEditMode(true);
    setUserData(user);
  };


  const handleSave = async (e) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Confirm Edit',
      content: 'Are you sure you want to edit your profile?',
      okText: 'Edit',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          // Get form values
          const values = await form.validateFields(); // Validate the form fields and get the values

          // Update the formData state with the form values
          setFormData((prevData) => ({
            ...prevData,
            ...values,
          }));

          // Create a new FormData object
          const updatedUserData = new FormData();
          Object.entries(values).forEach(([key, value]) => {
            if (key === 'ProfilePicture') {
              // Skip the ProfilePicture field if it's not updated
              if (formData.ProfilePicture) {
                updatedUserData.append(key, formData.ProfilePicture);
              }
            } else {
              updatedUserData.append(key, value);
            }
          });

          // Send the updated admin profile to the server
          const response = await axios.put(
            `http://localhost:3000/Users/${userData.id}`,
            updatedUserData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          const abcd = await axios.get(
            `http://localhost:3000/Users/${userData.id}`)
          console.log(abcd);
          // Update the admin data in local storage and state
          const updatedUser = response.data;
          localStorage.setItem('adminData', JSON.stringify(updatedUser.user));
          setUserData(updatedUser);
          console.log(formData);
          console.log(formData.ProfilePicture);
          console.log(updatedUser);

          message.success('Admin data updated successfully.');

        } catch (error) {
          console.error('Error updating admin profile:', error);
          message.error('Error updating admin profile');
        }

        setEditMode(false);
      },
    });
  };

  const handleLogout = () => {
    // Clear local storage and navigate to the login page
    localStorage.removeItem('userData');
    setUserData(null);
    navigate('/users');
  };

  return isLoggedInUser ?  (
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
          <Link to="/serviceProviders" className='nav-item'>Payments</Link>
        </div>
  

        
        <div className="profile-picture" onClick={() => handleEdit(userData)} >
  {(profilePictureUrl != null) ? (
    <img src={profilePictureUrl} alt="Profile" className="logo-image" style={{ width: '50px', height: '50px', margin: '10px', borderRadius: '50%' }} />
  ) : (
    <div style={{ width: '50px', height: '50px', margin: '10px', borderRadius: '50%', backgroundImage: 'linear-gradient(to right, rgb(95, 174, 230), rgb(3, 55, 100))', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <span style={{ fontSize: '24px', color: 'white' }}>
        {JSON.parse(localStorage.userData).user && JSON.parse(localStorage.userData).user.FirstName ? JSON.parse(localStorage.userData).user.FirstName.charAt(0) : null}
      </span>
    </div>
  )}
</div>
  <div className='login-box'>
   <LogoutOutlined className='login'/>
    <Link to="/login" className='login' onClick={handleLogout}>
    Logout
  </Link>
</div>
      </div>
  
      <div className='body'>
          <div className='body-1'>
            <div className='side-one'>
              <img src={BodyPhoto} alt='bodyphoto' className='body-image'></img>
            </div>
            <div className='side-two'>
              <div className='note1'>
                <h2> E-<span style={{ color: 'rgb(5, 145, 246)' }}>Payment</span> System</h2>
              </div>
              <div className='note2'>
                <h1>  <pre>Make Your Life </pre>
                  <pre>Easier With <span style={{ color: 'rgb(5, 145, 246)' }}>....</span></pre></h1>
              </div>
              <br />
              <hr className='horizontal-line' />
              <div className='note3'>
                <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Fusce tincidunt ante et feugiat fringilla.
                  Mauris vel purus in leo rhoncus auctor quis at ligula.
                  Suspendisse potenti. Nulla facilisi.</h4>
              </div>
            </div>
          </div>

          <div className='body-2'>
            <div className='msg'>
              <img src={Bill} alt="billimage" className='bill-icon'></img>
              <h5>Effortlessly settle bills digitally, saving time and eliminating physical transactions.</h5>
            </div>
            <div className='msg'>
              <img src={Cash} alt="cashimage" className='cash-icon'></img>
              <h5>Encrypting financial data ensures secure transactions, providing peace of mind.</h5>
            </div>
            <div className='msg'>
              <img src={Security} alt="Securityimage" className='security-icon'></img>
              <h5>Revolutionize payments with our secure, convenient, and innovative e-payment system.</h5>
            </div>
          </div>
        </div>
      <Modal
        title={editMode ? 'Edit Admin' : 'Create Admin'}
        visible={editMode}
        onCancel={() => {
          setEditMode(false);
          form.resetFields();
        }}
        onOk={handleSave}
      >
        <Form form={form} onSubmit={handleSave} initialValues={userData}>
          <Form.Item name="UserID" label="UserID" >
            <Input onChange={handleFormChange} name="UserID" disabled />
          </Form.Item>
          <Form.Item name="FirstName" label="First Name" >
            <Input onChange={handleFormChange} name="FirstName" />
          </Form.Item>
          <Form.Item name="LastName" label="Last Name" >
            <Input onChange={handleFormChange} name="LastName" />
          </Form.Item>
          <Form.Item name="Gender" label="Gender">
            <Input onChange={handleFormChange} name="Gender" />
          </Form.Item>
          <Form.Item name="UserName" label="User Name" >
            <Input onChange={handleFormChange} name="UserName" />
          </Form.Item>
          <Form.Item name="Email" label="Email" >
            <Input type="email" onChange={handleFormChange} name="Email" />
          </Form.Item>
          <Form.Item name="PhoneNumber" label="Phone Number" >
            <Input type="tel" onChange={handleFormChange} name="PhoneNumber" />
          </Form.Item>
          <Form.Item name="Address" label="Address" onChange={handleFormChange}>
            <Input onChange={handleFormChange} name="Address" />
          </Form.Item>
          <Form.Item name="ProfilePicture" >
            <label htmlFor="profilePicture">Profile Picture:</label>
            <input
              type="file"
              id="profilePicture"
              accept=".jpeg, .jpg, .png, .gif"
              onChange={handleProfilePictureChange}
            />
            {profilePictureUrl && (
              <img src={profilePictureUrl} alt="Profile" style={{ width: '200px' }} />
            )}
          </Form.Item>
    <Button type="primary" onClick={handleSave}>
      Save
    </Button>
  </Form>
</Modal>
<Footer>E-Payment System ©2023 Created by [____ Name]</Footer>

      
      </div>
   
  ):(
    <div className='container'>
      <div className="overlay-curve" ></div>
      <div className='header'>
        <div className='logo'>
          <img src={companyLogo} alt='company logo' />
          <div className='company-name'style={{width:'230px'}}>
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
          <Link to="/login" className='login'>Login</Link>
        </div>
      </div>

      <div className='body'>
          <div className='body-1'>
            <div className='side-one'>
              <img src={BodyPhoto} alt='bodyphoto' className='body-image'></img>
            </div>
            <div className='side-two'>
              <div className='note1'>
                <h2> E-<span style={{ color: 'rgb(5, 145, 246)' }}>Payment</span> System</h2>
              </div>
              <div className='note2'>
                <h1>  <pre>Make Your Life </pre>
                  <pre>Easier With <span style={{ color: 'rgb(5, 145, 246)' }}>....</span></pre></h1>
              </div>
              <br />
              <hr className='horizontal-line' />
              <div className='note3'>
                <h4>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Fusce tincidunt ante et feugiat fringilla.
                  Mauris vel purus in leo rhoncus auctor quis at ligula.
                  Suspendisse potenti. Nulla facilisi.</h4>
              </div>
            </div>
          </div>

          <div className='body-2'>
            <div className='msg'>
              <img src={Bill} alt="billimage" className='bill-icon'></img>
              <h5>Effortlessly settle bills digitally, saving time and eliminating physical transactions.</h5>
            </div>
            <div className='msg'>
              <img src={Cash} alt="cashimage" className='cash-icon'></img>
              <h5>Encrypting financial data ensures secure transactions, providing peace of mind.</h5>
            </div>
            <div className='msg'>
              <img src={Security} alt="Securityimage" className='security-icon'></img>
              <h5>Revolutionize payments with our secure, convenient, and innovative e-payment system.</h5>
            </div>
          </div>
        </div>
    </div>
  ) ;
}

export default HomePage;