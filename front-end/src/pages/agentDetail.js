import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import axios from 'axios';
import './styles.css'

const AgentDetail = ({ isLoggedIn, setIsLoggedIn }) => {
  const [agentData, setAgentData] = useState([]);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await axios.get('http://localhost:3000/agents');
      setAgentData(response.data);
    } catch (error) {
      message.error('Failed to fetch agents.');
    }
  };

  const handleAgentClick = (agent) => {
    // Handle button click for a specific agent
    // You can perform any action here based on the selected agent
    console.log('Selected agent:', agent);
  };

  const columns = [
    {
      dataIndex: 'agentName',
      key: 'agentName',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleAgentClick(record)}>
          {text}
        </Button>
      ),
    },
  ];

  return (
      <div className="container">
        <h1>Agents List</h1>
        <Table dataSource={agentData} columns={columns} className="ant-table" />
      </div>
  );
};

export default AgentDetail;