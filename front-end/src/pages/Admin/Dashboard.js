import React, { useEffect, useState } from 'react';
import axios from 'axios';
import companyLogo from '../../image/logoimage.jpg';
import { Layout, Menu, Avatar, Button, Form, Input, Upload, Modal, message } from 'antd';
import {
  UserOutlined,
  BankOutlined,
  SolutionOutlined,
  TransactionOutlined,
  LogoutOutlined,
  UploadOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = ({ content }) => {

  const navigate = useNavigate();
  if (!(localStorage.getItem('adminData'))) {
    navigate('/admin/login');
  }
  const [adminData, setAdminData] = useState(JSON.parse(localStorage.getItem('adminData')));
  const [form] = Form.useForm();
  const [editMode, setEditMode] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(`http://localhost:3000/${adminData.ProfilePicture}`);
  const [admin, setAdmin] = useState(null);
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(true);
  const { adminId } = useParams();
  const [formData, setFormData] = useState({
    UserID: '',
    FirstName: '',
    LastName: '',
    Gender: '',
    UserName: '',
    Email: '',
    PhoneNumber: '',
    Address: '',
    Role: '',
    ProfilePicture: '',
  });
  const [selectedMenu, setSelectedMenu] = useState(localStorage.getItem("selectedMenu") || "1");

  const handleMenuSelect = ({ key }) => {
    setSelectedMenu([key]);
  };

  useEffect(() => {
    localStorage.setItem("selectedMenu", selectedMenu);
    const loggedInAdmin = localStorage.getItem('adminData');
    if (loggedInAdmin) {
      try {
        const parsedAdminData = JSON.parse(loggedInAdmin);
        setFormData(parsedAdminData);
        setAdminData(parsedAdminData);
      } catch (error) {
        console.error('Error parsing admin data:', error);
        message.error('Error parsing admin data');
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

  const handleEdit = (admin) => {
    form.setFieldsValue(admin);
    setEditMode(true);
    setAdmin(admin);
  };

  const handleSiderHover = (isHovered) => {
    setIsSiderCollapsed(!isHovered);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    Modal.confirm({
      title: 'Confirm Edit',
      content: 'Are you sure you want to edit this agent?',
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
          const updatedAdminData = new FormData();
          Object.entries(values).forEach(([key, value]) => {
            if (key === 'ProfilePicture') {
              // Skip the ProfilePicture field if it's not updated
              if (formData.ProfilePicture) {
                updatedAdminData.append(key, formData.ProfilePicture);
              }
            } else {
              updatedAdminData.append(key, value);
            }
          });

          // Send the updated admin profile to the server
          const response = await axios.put(
            `http://localhost:3000/Users/${adminId}`,
            updatedAdminData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          );

          const abcd = await axios.get(
            `http://localhost:3000/Users/${adminId}`)
          console.log(abcd);
          // Update the admin data in local storage and state
          const updatedAdmin = response.data;
          localStorage.setItem('adminData', JSON.stringify(updatedAdmin.user));
          setAdminData(updatedAdmin);
          console.log(formData);
          console.log(formData.ProfilePicture);
          console.log(updatedAdmin);

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
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdminData(null);
    navigate('/admin/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={isSiderCollapsed ? 190 : 350}
        onMouseEnter={() => handleSiderHover(true)}
        onMouseLeave={() => handleSiderHover(false)}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          selectedKeys={[selectedMenu]}
          onSelect={handleMenuSelect}
        >
          <Menu theme="dark" mode="inline" selectedKeys={[selectedMenu]} onClick={(e) => setSelectedMenu(e.key)}></Menu>

          <div className="avatar" style={{ display: 'flex', alignItems: 'center', maxWidth: '100%' }}>
            <div
              backgroundcolor='#fffff'
              className='avatar'
              size="large"
            >

              <div className="company-name">
                <div className="logo-container">
                  <div className="circle-image" style={{ width: '75px', height: '75px', marginLeft: '30px' }}>
                    <div className="coin-animation">
                      <div className="coin-inner-animation">
                        <img src={companyLogo} alt="Logo" className="logo-image" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        <div className="splash-animation" />
                      </div>
                    </div>
                  </div>
                  <div className="slogan-container" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="slogan" style={{ '--delay': '0s' }}>
                      your
                    </div>
                    <div className="slogan" style={{ '--delay': '0.2s' }}>
                      trusted
                    </div>
                    <div className="slogan" style={{ '--delay': '0.4s' }}>
                      online
                    </div>
                    <div className="slogan" style={{ '--delay': '0.6s' }}>
                      payment
                    </div>
                    <div className="slogan" style={{ '--delay': '0.8s' }}>
                      system
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <Menu.SubMenu key="submenu" icon={<HomeOutlined />} title="E-Payment System" style={{ marginTop: '40px' }}>
            <Menu.Item key="2" icon={<BankOutlined />}>
              <Link to={`/admin/agents/registration/${formData.id}`}>Agents Registration</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<BankOutlined />}>
              <Link to={`/admin/agents/${formData.id}`}>Agents List</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<SolutionOutlined />}>
              <Link to={`/admin/service-providers/registration/${formData.id}`}>Service Providers Registration</Link>
            </Menu.Item>
            <Menu.Item key="5" icon={<SolutionOutlined />}>
              <Link to={`/admin/service-providers/${formData.id}`}>Service Providers List</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<UserOutlined />}>
              <Link to={`/admin/user/registration/${formData.id}`}>Admin Registration</Link>
            </Menu.Item>
            <Menu.Item key="7" icon={<UserOutlined />}>
              <Link to={`/admin/adminsList/${formData.id}`}>Admin List</Link>
            </Menu.Item>
            <Menu.Item key="8" icon={<UserOutlined />}>
              <Link to={`/admin/usersList/${formData.id}`}>Users List</Link>
            </Menu.Item>
            <Menu.Item key="9" icon={<TransactionOutlined />}>
              <Link to={`/admin/transactions/${formData.id}`}>Transactions</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, display: 'flex', justifyContent: 'space-between' }}>
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center' }}>
            <Link type="primary" onClick={() => handleEdit(adminData)}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {profilePictureUrl != null ? (
                  <img src={profilePictureUrl} alt="Profile" className="logo-image" style={{ width: '50px', height: '50px', margin: '10px', borderRadius: '50%' }} />
                ) : JSON.parse(localStorage.adminData) && JSON.parse(localStorage.adminData).FirstName ? JSON.parse(localStorage.adminData).FirstName.charAt(0) : null}
                <span className="user-name">{formData.FirstName} {formData.LastName}</span>
              </div>
            </Link>
          </div>
          <Link to="/admin/login" onClick={handleLogout} style={{ paddingRight: 20 }}>
            <LogoutOutlined />
            Logout
          </Link>
        </Header>
        <Content style={{ margin: '0 16px' }} >
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {content}
          </div>
        </Content>

        <Modal
          title={editMode ? 'Edit Admin' : 'Create Admin'}
          visible={editMode}
          onCancel={() => {
            setEditMode(false);
            form.resetFields();
          }}
          onOk={handleSave}
        >
          <Form form={form} onSubmit={handleSave} initialValues={admin}>
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
      </Layout>
    </Layout>
  );
};

export default Dashboard;






