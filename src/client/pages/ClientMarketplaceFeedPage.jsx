import React, { useState, useEffect } from 'react';
import { Card, Typography, Space, Button, Avatar, List, Tag, message, Spin, Tabs } from 'antd';
import { AppstoreOutlined, FireOutlined, GlobalOutlined, LikeOutlined, ShareAltOutlined, StarOutlined } from '@ant-design/icons';
import api from '../../platform/common/services/api';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const ClientMarketplaceFeedPage = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/feed');
      setFeed(response.data?.data || response.data || []);
    } catch (error) {
      console.warn('Using fallback data for marketplace feed', error);
      setFeed([
        {
          id: '1',
          type: 'GIG',
          title: 'I will design an enterprise SAAS UI/UX',
          author: { name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?u=1' },
          description: 'Top rated designer with 10 years experience in Figma, React, and Enterprise Systems.',
          price: '$5,000+',
          rating: 4.9,
          timestamp: '2 hours ago',
          tags: ['UI/UX', 'Figma', 'SaaS']
        },
        {
          id: '2',
          type: 'TALENT',
          title: 'Senior Backend Engineer Available',
          author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?u=2' },
          description: 'Specializing in Node.js, microservices, and database architecture.',
          price: '$120/hr',
          rating: 5.0,
          timestamp: '5 hours ago',
          tags: ['Node.js', 'PostgreSQL', 'Architecture']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFeedItem = (item) => (
    <Card style={{ marginBottom: '16px', borderRadius: '12px' }} hoverable>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Space align="start">
          <Avatar src={item.author.avatar} size={48} />
          <div>
            <Title level={5} style={{ margin: 0 }}>{item.title}</Title>
            <Text type="secondary">{item.author.name} • {item.timestamp}</Text>
            <Paragraph style={{ marginTop: '8px', marginBottom: '8px' }}>
              {item.description}
            </Paragraph>
            <Space size={[0, 8]} wrap>
              {item.tags?.map(tag => <Tag key={tag} color="blue">{tag}</Tag>)}
            </Space>
          </div>
        </Space>
        <div style={{ textAlign: 'right' }}>
          <Tag color={item.type === 'GIG' ? 'purple' : 'green'} style={{ marginBottom: '8px' }}>
            {item.type}
          </Tag>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{item.price}</div>
          <div><StarOutlined style={{ color: '#faad14' }} /> {item.rating}</div>
        </div>
      </div>
      <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px', display: 'flex', gap: '16px' }}>
        <Button type="text" icon={<LikeOutlined />}>Like</Button>
        <Button type="text" icon={<ShareAltOutlined />}>Share</Button>
        <Button type="primary" style={{ marginLeft: 'auto' }}>View Details</Button>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>
          <GlobalOutlined style={{ marginRight: '12px' }} />
          Marketplace Feed
        </Title>
        <Paragraph>Discover top talent, trending gigs, and platform updates tailored for you.</Paragraph>
      </div>

      <Tabs defaultActiveKey="for_you">
        <TabPane tab={<span><FireOutlined />For You</span>} key="for_you">
          {loading ? <Spin size="large" style={{ display: 'block', margin: '40px auto' }} /> : (
            <List
              dataSource={feed}
              renderItem={renderFeedItem}
            />
          )}
        </TabPane>
        <TabPane tab={<span><AppstoreOutlined />Following</span>} key="following">
          <List dataSource={[]} renderItem={() => null} locale={{ emptyText: 'Follow freelancers to see their updates here.' }} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ClientMarketplaceFeedPage;
