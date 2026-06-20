import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Button, Tag, message, Modal, Input, Descriptions, Progress } from 'antd';
import { SafetyOutlined, SearchOutlined, WarningOutlined, StopOutlined, ScanOutlined } from '@ant-design/icons';
import api from '../api/apiClient';

const { Title, Paragraph } = Typography;

const AdminFraudDashboardPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userIdSearch, setUserIdSearch] = useState('');
  const [userRiskData, setUserRiskData] = useState(null);
  const [isRiskModalVisible, setIsRiskModalVisible] = useState(false);
  const [actionReason, setActionReason] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/fraud/logs');
      setLogs(response.data?.data || response.data || []);
    } catch (error) {
      console.warn('Using fallback data for fraud logs', error);
      setLogs([
        { id: '1', userId: 'usr_123', event: 'Suspicious Login', riskScore: 85, timestamp: new Date().toISOString() },
        { id: '2', userId: 'usr_456', event: 'Multiple Payment Failures', riskScore: 60, timestamp: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRisk = async () => {
    if (!userIdSearch) return;
    try {
      const response = await api.get(`/api/fraud/user/${userIdSearch}`);
      setUserRiskData(response.data?.data || response.data || { userId: userIdSearch, riskScore: 20, status: 'CLEAR', reason: 'No flags found' });
      setIsRiskModalVisible(true);
    } catch (error) {
      message.error('Failed to retrieve user risk data');
    }
  };

  const handleAction = async (actionType, userId) => {
    try {
      if (actionType === 'FLAG') {
        await api.post(`/api/fraud/flag/${userId}`, { reason: actionReason || 'Manual flag' });
        message.success('User flagged successfully');
      } else if (actionType === 'BAN') {
        await api.post(`/api/fraud/action/${userId}`, { action: 'BAN', reason: actionReason || 'Fraud violation' });
        message.success('User banned successfully');
      } else if (actionType === 'ANALYZE') {
        await api.post(`/api/fraud/analyze/${userId}`);
        message.success('Deep analysis triggered');
      }
      setIsRiskModalVisible(false);
      setActionReason('');
      fetchLogs();
    } catch (error) {
      message.error(`Failed to execute ${actionType}`);
    }
  };

  const columns = [
    { title: 'Log ID', dataIndex: 'id', key: 'id' },
    { title: 'User ID', dataIndex: 'userId', key: 'userId', render: (id) => <Button type="link" onClick={() => { setUserIdSearch(id); checkUserRisk(); }}>{id}</Button> },
    { title: 'Event', dataIndex: 'event', key: 'event' },
    { 
      title: 'Risk Score', 
      dataIndex: 'riskScore', 
      key: 'riskScore', 
      render: (score) => (
        <Space>
          <Progress type="circle" percent={score} size={24} status={score > 75 ? 'exception' : score > 40 ? 'normal' : 'success'} showInfo={false} />
          {score}
        </Space>
      ) 
    },
    { title: 'Time', dataIndex: 'timestamp', key: 'timestamp', render: (time) => new Date(time).toLocaleString() },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <SafetyOutlined style={{ marginRight: '12px' }} />
            Fraud Prevention Center
          </Title>
          <Paragraph>Monitor platform risk, analyze users, and enforce security policies.</Paragraph>
        </div>
        <Space>
          <Input 
            placeholder="User ID" 
            value={userIdSearch} 
            onChange={(e) => setUserIdSearch(e.target.value)} 
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={checkUserRisk}>
            Lookup User
          </Button>
        </Space>
      </div>

      <Card bordered={false} title="Recent Fraud Logs">
        <Table 
          columns={columns} 
          dataSource={logs} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 15 }}
        />
      </Card>

      <Modal
        title="User Risk Analysis"
        visible={isRiskModalVisible}
        onCancel={() => setIsRiskModalVisible(false)}
        footer={null}
      >
        {userRiskData && (
          <div>
            <Descriptions column={1} bordered size="small" style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="User ID">{userRiskData.userId}</Descriptions.Item>
              <Descriptions.Item label="Risk Score">
                <Space>
                  <Progress percent={userRiskData.riskScore} status={userRiskData.riskScore > 75 ? 'exception' : userRiskData.riskScore > 40 ? 'normal' : 'success'} />
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={userRiskData.status === 'CLEAR' ? 'green' : 'red'}>{userRiskData.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Reason / Notes">{userRiskData.reason}</Descriptions.Item>
            </Descriptions>

            <Input.TextArea 
              placeholder="Reason for action..." 
              value={actionReason} 
              onChange={(e) => setActionReason(e.target.value)} 
              style={{ marginBottom: '16px' }}
            />

            <Space wrap>
              <Button icon={<ScanOutlined />} onClick={() => handleAction('ANALYZE', userRiskData.userId)}>Deep Scan</Button>
              <Button icon={<WarningOutlined />} type="default" danger onClick={() => handleAction('FLAG', userRiskData.userId)}>Flag User</Button>
              <Button icon={<StopOutlined />} type="primary" danger onClick={() => handleAction('BAN', userRiskData.userId)}>Ban User</Button>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminFraudDashboardPage;
