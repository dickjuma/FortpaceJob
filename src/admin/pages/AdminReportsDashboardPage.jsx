import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Button, Tag, message, Modal, Input, Descriptions, Badge } from 'antd';
import { FlagOutlined, SafetyCertificateOutlined, MessageOutlined, CheckCircleOutlined } from '@ant-design/icons';
import api from '../api/apiClient';

const { Title, Paragraph } = Typography;

const AdminReportsDashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/reports');
      setReports(response.data?.data || response.data || []);
    } catch (error) {
      console.warn('Using fallback data for reports', error);
      setReports([
        { id: '1', reporterId: 'usr_abc', targetId: 'usr_xyz', type: 'HARASSMENT', status: 'PENDING', description: 'Inappropriate language in messages', timestamp: new Date().toISOString() },
        { id: '2', reporterId: 'usr_123', targetId: 'gig_456', type: 'SPAM', status: 'RESOLVED', description: 'Fake gig listing', timestamp: new Date(Date.now() - 86400000).toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!currentReport) return;
    try {
      await api.patch(`/api/reports/${currentReport.id}/resolve`, {
        resolution: 'ACTION_TAKEN',
        notes: resolutionNote || 'Resolved by admin'
      });
      message.success('Report resolved');
      setIsModalVisible(false);
      setResolutionNote('');
      fetchReports();
    } catch (error) {
      message.error('Failed to resolve report');
    }
  };

  const openReport = (report) => {
    setCurrentReport(report);
    setIsModalVisible(true);
  };

  const columns = [
    { title: 'Report ID', dataIndex: 'id', key: 'id' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: type => <Tag color="volcano">{type}</Tag> },
    { title: 'Target', dataIndex: 'targetId', key: 'targetId' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: status => <Badge status={status === 'RESOLVED' ? 'success' : 'processing'} text={status} /> 
    },
    { title: 'Time', dataIndex: 'timestamp', key: 'timestamp', render: time => new Date(time).toLocaleString() },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button size="small" type="primary" onClick={() => openReport(record)}>View</Button>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <FlagOutlined style={{ marginRight: '12px', color: '#f5222d' }} />
            Platform Reports
          </Title>
          <Paragraph>Review and resolve user-generated reports regarding platform safety.</Paragraph>
        </div>
      </div>

      <Card bordered={false}>
        <Table 
          columns={columns} 
          dataSource={reports} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 15 }}
        />
      </Card>

      <Modal
        title="Report Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>Cancel</Button>,
          <Button 
            key="resolve" 
            type="primary" 
            danger 
            icon={<CheckCircleOutlined />} 
            onClick={handleResolve}
            disabled={currentReport?.status === 'RESOLVED'}
          >
            Mark as Resolved
          </Button>
        ]}
      >
        {currentReport && (
          <div>
            <Descriptions column={1} bordered size="small" style={{ marginBottom: '24px' }}>
              <Descriptions.Item label="Reporter ID">{currentReport.reporterId}</Descriptions.Item>
              <Descriptions.Item label="Target ID">{currentReport.targetId}</Descriptions.Item>
              <Descriptions.Item label="Report Type"><Tag color="volcano">{currentReport.type}</Tag></Descriptions.Item>
              <Descriptions.Item label="Status"><Badge status={currentReport.status === 'RESOLVED' ? 'success' : 'processing'} text={currentReport.status} /></Descriptions.Item>
              <Descriptions.Item label="Description">{currentReport.description}</Descriptions.Item>
            </Descriptions>

            {currentReport.status !== 'RESOLVED' && (
              <>
                <Typography.Text strong>Resolution Notes (Internal)</Typography.Text>
                <Input.TextArea 
                  rows={4} 
                  placeholder="Action taken (e.g., Warning issued, account suspended...)" 
                  value={resolutionNote}
                  onChange={e => setResolutionNote(e.target.value)}
                  style={{ marginTop: '8px' }}
                />
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminReportsDashboardPage;
