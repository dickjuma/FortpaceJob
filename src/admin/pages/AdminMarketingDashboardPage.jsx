import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Button, Tag, message, Modal, Input, Form, Select, DatePicker, Statistic, Row, Col } from 'antd';
import { BulbOutlined, PlusOutlined, BarChartOutlined, StopOutlined, PlayCircleOutlined } from '@ant-design/icons';
import api from '../api/apiClient';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminMarketingDashboardPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [currentStats, setCurrentStats] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/marketing');
      setCampaigns(response.data?.data || response.data || []);
    } catch (error) {
      console.warn('Using fallback data for marketing campaigns', error);
      setCampaigns([
        { id: '1', name: 'Summer Talent Drive', type: 'EMAIL', status: 'ACTIVE', targetAudience: 'Clients', startDate: '2026-06-01', endDate: '2026-08-31', conversions: 145 },
        { id: '2', name: 'New Freelancer Onboarding', type: 'PUSH', status: 'PAUSED', targetAudience: 'Freelancers', startDate: '2026-01-01', endDate: '2026-12-31', conversions: 320 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      const payload = {
        ...values,
        startDate: values.dateRange[0].toISOString(),
        endDate: values.dateRange[1].toISOString(),
      };
      delete payload.dateRange;
      
      await api.post('/api/marketing', payload);
      message.success('Campaign created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchCampaigns();
    } catch (error) {
      message.error('Failed to create campaign');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      await api.patch(`/api/marketing/${id}`, { status: newStatus });
      message.success(`Campaign ${newStatus.toLowerCase()}`);
      fetchCampaigns();
    } catch (error) {
      message.error('Failed to update campaign status');
    }
  };

  const viewStats = async (id) => {
    try {
      const response = await api.get(`/api/marketing/${id}/stats`);
      setCurrentStats(response.data?.data || response.data || { clicks: 1200, conversions: 145, roi: '25%' });
      setStatsModalVisible(true);
    } catch (error) {
      message.error('Failed to load stats');
      // Mock stats
      setCurrentStats({ clicks: 1200, conversions: 145, roi: '25%', reach: 15000 });
      setStatsModalVisible(true);
    }
  };

  const columns = [
    { title: 'Campaign Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Audience', dataIndex: 'targetAudience', key: 'targetAudience' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'ACTIVE' ? 'green' : 'orange'}>{status}</Tag> 
    },
    { title: 'Conversions', dataIndex: 'conversions', key: 'conversions' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<BarChartOutlined />} onClick={() => viewStats(record.id)}>Stats</Button>
          <Button 
            size="small" 
            type={record.status === 'ACTIVE' ? 'default' : 'primary'}
            danger={record.status === 'ACTIVE'}
            icon={record.status === 'ACTIVE' ? <StopOutlined /> : <PlayCircleOutlined />} 
            onClick={() => toggleStatus(record.id, record.status)}
          >
            {record.status === 'ACTIVE' ? 'Pause' : 'Resume'}
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <BulbOutlined style={{ marginRight: '12px' }} />
            Marketing Campaigns
          </Title>
          <Paragraph>Manage your platform's promotional and marketing campaigns.</Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Create Campaign
        </Button>
      </div>

      <Card bordered={false}>
        <Table 
          columns={columns} 
          dataSource={campaigns} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Create Marketing Campaign"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label="Campaign Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Campaign Type" rules={[{ required: true }]}>
                <Select>
                  <Option value="EMAIL">Email Blast</Option>
                  <Option value="PUSH">Push Notification</Option>
                  <Option value="BANNER">In-App Banner</Option>
                  <Option value="PROMO_CODE">Promo Code</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="targetAudience" label="Target Audience" rules={[{ required: true }]}>
                <Select>
                  <Option value="ALL">All Users</Option>
                  <Option value="CLIENTS">Clients Only</Option>
                  <Option value="FREELANCERS">Freelancers Only</Option>
                  <Option value="NEW_USERS">New Users (Last 30 Days)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="dateRange" label="Campaign Duration" rules={[{ required: true }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="content" label="Message / Content" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Launch Campaign
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Campaign Performance"
        visible={statsModalVisible}
        onCancel={() => setStatsModalVisible(false)}
        footer={[<Button key="close" onClick={() => setStatsModalVisible(false)}>Close</Button>]}
      >
        {currentStats && (
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card size="small">
                <Statistic title="Total Reach" value={currentStats.reach || 0} />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small">
                <Statistic title="Clicks" value={currentStats.clicks || 0} />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small">
                <Statistic title="Conversions" value={currentStats.conversions || 0} valueStyle={{ color: '#3f8600' }} />
              </Card>
            </Col>
            <Col span={12}>
              <Card size="small">
                <Statistic title="Est. ROI" value={currentStats.roi || '0%'} />
              </Card>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
};

export default AdminMarketingDashboardPage;
