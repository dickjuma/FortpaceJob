import React, { useState, useEffect } from 'react';
import { Card, Typography, Row, Col, Avatar, Button, Rate, Spin, message, Space, Tag, Empty } from 'antd';
import { SearchOutlined, TrophyOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import api from '../../platform/common/services/api';

const { Title, Text, Paragraph } = Typography;

const ClientComparePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Parse query params like ?type=talent&ids=1,2,3
    const query = new URLSearchParams(location.search);
    const type = query.get('type') || 'talent';
    const ids = query.get('ids');

    if (ids) {
      fetchComparison(type, ids);
    }
  }, [location.search]);

  const fetchComparison = async (type, ids) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/compare-engine/${type}?ids=${ids}`);
      setData(response.data?.data || response.data || []);
    } catch (error) {
      console.warn('Comparison failed, using fallback data', error);
      setData([
        { id: '1', name: 'John Doe', title: 'Senior Developer', rating: 4.8, hourlyRate: 50, skills: ['React', 'Node.js'] },
        { id: '2', name: 'Jane Smith', title: 'Full Stack Engineer', rating: 4.9, hourlyRate: 65, skills: ['React', 'Python', 'AWS'] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}><Spin size="large" /></div>;
  }

  if (data.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Empty description="No profiles selected for comparison. Select profiles from the Talent Search page." />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Talent Comparison</Title>
      <Paragraph>Compare selected freelancers side-by-side to find the perfect fit for your project.</Paragraph>

      <Row gutter={[24, 24]} wrap={false} style={{ overflowX: 'auto', paddingBottom: '20px' }}>
        {data.map((item) => (
          <Col key={item.id} style={{ minWidth: '300px' }}>
            <Card 
              hoverable
              style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              bodyStyle={{ flex: 1 }}
            >
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Avatar size={64} src={item.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || 'User')}`} />
                <Title level={4} style={{ marginTop: '12px', marginBottom: 0 }}>{item.name}</Title>
                <Text type="secondary">{item.title}</Text>
              </div>

              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <Rate disabled defaultValue={item.rating || 0} allowHalf />
                <Text style={{ marginLeft: '8px' }}>({item.rating || 'New'})</Text>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>Hourly Rate: </Text>
                <Text>${item.hourlyRate}/hr</Text>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>Top Skills: </Text>
                <div style={{ marginTop: '8px' }}>
                  {item.skills?.map((skill, idx) => (
                    <Tag key={idx} color="blue" style={{ marginBottom: '4px' }}>{skill}</Tag>
                  )) || <Text type="secondary">N/A</Text>}
                </div>
              </div>

              <div style={{ marginTop: 'auto', pt: '16px' }}>
                <Button type="primary" block>Hire {item.name.split(' ')[0]}</Button>
                <Button block style={{ marginTop: '8px' }}>View Full Profile</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ClientComparePage;
