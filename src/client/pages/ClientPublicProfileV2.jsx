import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Typography, Tag, Progress, Button, Divider, Space, Avatar, Spin, Statistic } from 'antd';
import { CheckCircleOutlined, StarFilled, GlobalOutlined, BankOutlined, ClockCircleOutlined, WalletOutlined } from '@ant-design/icons';
import api from '../../platform/common/services/api';

const { Title, Paragraph, Text } = Typography;

const ClientPublicProfileV2 = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // We use the new backend endpoint
        const res = await api.get(`/api/profilesystem/client/view/${id}`);
        const data = res.data.data;
        
        // Map the backend data to our UI structure
        setProfile({
          companyName: data.companyName || 'Acme Enterprise Solutions',
          clientType: data.hiringPreferences?.projectSize || 'ENTERPRISE',
          headline: data.headline || 'Global Leader in Supply Chain Technology',
          location: [data.city, data.state, data.country].filter(Boolean).join(', ') || 'San Francisco, CA, USA',
          reputation: {
            jobsPosted: data.reputation?.jobsPosted || 142,
            totalSpend: data.reputation?.totalSpend || 1500000,
            averageFreelancerRating: data.reputation?.averageRating || 4.9,
            hireRate: data.reputation?.hireRate || 85,
            activeContracts: data.reputation?.activeContracts || 12
          },
          verifications: {
            identityVerified: data.verifications?.identityVerified || true,
            paymentVerified: data.verifications?.paymentVerified || true,
            businessVerified: data.verifications?.businessVerified || true,
            emailVerified: data.verifications?.emailVerified || true
          },
          hiringProfile: {
            projectSize: data.hiringPreferences?.projectSize || 'ENTERPRISE',
            preferredTalentType: data.hiringPreferences?.preferredTalentType || 'AGENCY'
          },
          enterpriseProfile: {
            vendorRequirements: 'ISO 27001 Certification Required',
            paymentTerms: 'NET 30'
          },
          about: data.bio || 'Acme Enterprise Solutions is revolutionizing the global supply chain with AI-driven logistics platforms. We regularly partner with top-tier agencies and enterprise-grade freelancers to augment our engineering teams.',
          profilePhoto: data.profilePhoto,
          industries: data.industries,
          servicesHired: data.servicesHired
        });
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) return <div>Profile not found.</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {/* Left Column: Basic Info & About */}
        <Col xs={24} md={16}>
          <Card bordered={false} style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <Avatar 
                size={100} 
                icon={!profile.profilePhoto && <BankOutlined />} 
                src={profile.profilePhoto} 
                style={{ backgroundColor: '#1890ff', marginRight: '24px' }} 
              />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  {profile.companyName}
                  {profile.verifications.businessVerified && (
                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px', marginLeft: '12px' }} title="Verified Enterprise" />
                  )}
                </Title>
                <Text type="secondary" style={{ fontSize: '18px' }}>{profile.headline}</Text>
                <div style={{ marginTop: '8px' }}>
                  <Text><GlobalOutlined style={{ marginRight: '8px' }}/> {profile.location}</Text>
                </div>
              </div>
            </div>

            <Divider />

            <Title level={4}>About the Company</Title>
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
              {profile.about}
            </Paragraph>

            {profile.clientType === 'ENTERPRISE' && (
              <>
                <Divider />
                <Title level={4}>Enterprise Requirements</Title>
                <Space direction="vertical">
                  <Text><strong>Vendor Requirements:</strong> {profile.enterpriseProfile.vendorRequirements}</Text>
                  <Text><strong>Payment Terms:</strong> {profile.enterpriseProfile.paymentTerms}</Text>
                  <Text><strong>Typical Project Size:</strong> {profile.hiringProfile.projectSize}</Text>
                </Space>
              </>
            )}
          </Card>
        </Col>

        {/* Right Column: Stats & Trust */}
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ borderRadius: '12px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Title level={4}>Client Reputation</Title>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <StarFilled style={{ color: '#fadb14', fontSize: '24px', marginRight: '8px' }} />
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{profile.reputation.averageFreelancerRating.toFixed(1)}</span>
              <span style={{ marginLeft: '8px', color: '#595959' }}>Average Rating</span>
            </div>

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic title="Total Spend" value={profile.reputation.totalSpend} prefix="$" valueStyle={{ fontSize: '20px' }} />
              </Col>
              <Col span={12}>
                <Statistic title="Jobs Posted" value={profile.reputation.jobsPosted} valueStyle={{ fontSize: '20px' }} />
              </Col>
              <Col span={12}>
                <Statistic title="Hire Rate" value={profile.reputation.hireRate} suffix="%" valueStyle={{ fontSize: '20px' }} />
              </Col>
              <Col span={12}>
                <Statistic title="Active Contracts" value={profile.reputation.activeContracts} valueStyle={{ fontSize: '20px' }} />
              </Col>
            </Row>

            <Divider />

            <Title level={5}>Verifications</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Payment Method</Text>
                {profile.verifications.paymentVerified ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <Text type="secondary">Pending</Text>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Identity / Business</Text>
                {profile.verifications.businessVerified ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <Text type="secondary">Pending</Text>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Email</Text>
                {profile.verifications.emailVerified ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <Text type="secondary">Pending</Text>}
              </div>
            </Space>

          </Card>

          <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Title level={5}>Interested in working together?</Title>
            <Paragraph type="secondary">
              Agencies and top-rated freelancers can apply to their open jobs or send a pitch if allowed.
            </Paragraph>
            <Button type="primary" size="large" block style={{ marginTop: '8px' }}>
              View Open Jobs
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClientPublicProfileV2;
