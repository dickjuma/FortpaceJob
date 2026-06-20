import React, { useState } from 'react';
import { Card, Typography, Space, Button, message, Form, Input, Progress, Alert } from 'antd';
import { CalculatorOutlined, SyncOutlined } from '@ant-design/icons';
import api from '../api/apiClient';

const { Title, Paragraph } = Typography;

const AdminRankingEnginePage = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRecalculate = async (values) => {
    setLoading(true);
    setProgress(0);
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 90 ? 90 : prev + 10));
      }, 500);

      await api.post('/api/ranking/recalculate', values);
      
      clearInterval(interval);
      setProgress(100);
      message.success('Ranking scores recalculated successfully!');
    } catch (error) {
      setProgress(0);
      message.error('Failed to recalculate rankings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>
          <CalculatorOutlined style={{ marginRight: '12px' }} />
          Ranking Engine Admin
        </Title>
        <Paragraph>Manually trigger recalculation of talent and gig ranking scores across the platform.</Paragraph>
      </div>

      <Card bordered={false}>
        <Alert
          message="Warning: Resource Intensive Operation"
          description="Recalculating ranking scores will query large amounts of data and may take some time depending on the database size."
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Form layout="vertical" onFinish={handleRecalculate}>
          <Form.Item name="entityType" label="Target Entity (Optional)">
            <Input placeholder="e.g., TALENT, GIG, ALL" />
          </Form.Item>
          
          {loading && (
            <div style={{ marginBottom: '24px' }}>
              <Progress percent={progress} status="active" />
            </div>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SyncOutlined spin={loading} />} 
              loading={loading}
              block
              size="large"
            >
              Trigger Recalculation
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminRankingEnginePage;
