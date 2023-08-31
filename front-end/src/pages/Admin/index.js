import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import { Layout } from 'antd';
import LOGO from '../../image/logoimage.jpg';
import './style.css';

const Home = ({ content }) => {
  const [adminData, setAdminData] = useState(JSON.parse(localStorage.getItem('adminData')));
  const [selectedMenu, setSelectedMenu] = useState(['1']);

  const handleCoinClick = (event) => {
    const splashElement = document.querySelector('.splash-animation');
    splashElement.style.top = `${event.clientY}px`;
    splashElement.style.left = `${event.clientX}px`;
    splashElement.classList.add('show');
    setTimeout(() => {
      splashElement.classList.remove('show');
    }, 1000);
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'adminData') {
        setAdminData(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const updatedAdminData = JSON.parse(localStorage.getItem('adminData'));
    setAdminData(updatedAdminData);
  }, [adminData]);

  return (
    <Dashboard
      selectedMenu={selectedMenu}
      content={
        <Layout>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <h1 style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>
              Welcome to E-Payment, {adminData.FirstName}!
            </h1>

            <h2 style={{ fontSize: 20, color: 'rgb(5, 145, 246)', textAlign: 'center', marginBottom: 24 }}>
              E-<span style={{ color: 'rgb(5, 145, 246)' }}>Payment</span> System
            </h2>

            <div
              className="note2"
              style={{
                backgroundColor: 'rgb(240, 240, 240)',
                borderRadius: 8,
                padding: 16,
                marginBottom: 24,
                textAlign: 'center',
              }}
            >
              <h1 style={{ fontSize: 28, fontWeight: 'bold' }}>
                Make Your Life <br /> Easier With <span style={{ color: 'rgb(5, 145, 246)' }}>....</span>
              </h1>
            </div>

            <hr className="horizontal-line" style={{ marginBottom: 24 }} />

            <div
              className="note3"
              style={{ backgroundColor: 'rgb(250, 250, 250)', borderRadius: 8, padding: 16, textAlign: 'center' }}
            >
              <h4 style={{ fontSize: 16 }}>{/* Add your content here */}</h4>
            </div>
          </div>
        </Layout>
      }
    />
  );
};

export default Home;