import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Row, Col, Statistic, Button, message, Spin, Tag } from 'antd';
import { LinkOutlined, DollarOutlined, UserAddOutlined } from '@ant-design/icons';
import api from '../../infrastructure/api';

const { Title, Paragraph } = Typography;

const AffiliateReferralDashboardPage = () => {
  const [account, setAccount] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accountRes, referralsRes, commissionsRes] = await Promise.all([
        api.get('/api/affiliates').catch(() => ({ data: { data: { referralCode: 'AFF-DEMO', totalEarnings: 0 } } })),
        api.get('/api/affiliates/referrals').catch(() => ({ data: { data: [] } })),
        api.get('/api/affiliates/commissions').catch(() => ({ data: { data: [] } }))
      ]);
      
      setAccount(accountRes.data?.data || accountRes.data);
      setReferrals(referralsRes.data?.data || referralsRes.data || []);
      setCommissions(commissionsRes.data?.data || commissionsRes.data || []);
    } catch (error) {
      message.error('Failed to load affiliate dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (account?.referralCode) {
      const link = `${window.location.origin}/register?ref=${account.referralCode}`;
      navigator.clipboard.writeText(link);
      message.success('Referral link copied to clipboard!');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;
  }

  const referralColumns = [
    { title: 'Referred User', dataIndex: 'referredUserId', key: 'referredUserId' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'ACTIVE' ? 'green' : 'default'}>{status}</Tag> },
    { title: 'Join Date', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
  ];

  const commissionColumns = [
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amt) => `$${parseFloat(amt).toFixed(2)}` },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'PAID' ? 'green' : 'orange'}>{status}</Tag> },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2}>Affiliate Dashboard</Title>
      <Paragraph>Manage your referrals, track your commissions, and grow your network.</Paragraph>

      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic title="Total Earnings" value={account?.totalEarnings || 0} precision={2} prefix={<DollarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Statistic title="Total Referrals" value={referrals.length} prefix={<UserAddOutlined />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Title level={4}>Your Referral Link</Title>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <Button type="primary" icon={<LinkOutlined />} onClick={copyReferralLink} block>
                Copy Link ({account?.referralCode})
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="Recent Referrals" bordered={false}>
            <Table 
              dataSource={referrals} 
              columns={referralColumns} 
              rowKey="id" 
              pagination={{ pageSize: 5 }} 
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Recent Commissions" bordered={false}>
            <Table 
              dataSource={commissions} 
              columns={commissionColumns} 
              rowKey="id" 
              pagination={{ pageSize: 5 }} 
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AffiliateReferralDashboardPage;
