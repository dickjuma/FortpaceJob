import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Button, message, Tag, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';
import api from '../api/apiClient';

const { Title } = Typography;
const { Option } = Select;

const AdminCmsDashboardPage = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/cms');
      setContent(response.data?.data || response.data || []);
    } catch (error) {
      console.warn('Using fallback CMS data', error);
      setContent([
        { id: '1', title: 'Terms of Service', slug: 'terms', type: 'PAGE', status: 'PUBLISHED', updatedAt: new Date().toISOString() },
        { id: '2', title: 'Privacy Policy', slug: 'privacy', type: 'PAGE', status: 'DRAFT', updatedAt: new Date().toISOString() },
        { id: '3', title: 'Welcome to Forte', slug: 'welcome', type: 'BLOG', status: 'PUBLISHED', updatedAt: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEdit = async (values) => {
    try {
      if (editingContent) {
        await api.patch(`/api/cms/${editingContent.id}`, values);
        message.success('Content updated successfully');
      } else {
        await api.post('/api/cms', values);
        message.success('Content created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchContent();
    } catch (error) {
      message.error(`Failed to ${editingContent ? 'update' : 'create'} content`);
    }
  };

  const publishContent = async (id) => {
    try {
      await api.post(`/api/cms/${id}/publish`);
      message.success('Content published');
      fetchContent();
    } catch (error) {
      message.error('Failed to publish content');
    }
  };

  const deleteContent = async (id) => {
    try {
      await api.delete(`/api/cms/${id}`);
      message.success('Content deleted');
      fetchContent();
    } catch (error) {
      message.error('Failed to delete content');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (type) => <Tag color="blue">{type}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'PUBLISHED' ? 'green' : 'orange'}>{status}</Tag> },
    { title: 'Last Updated', dataIndex: 'updatedAt', key: 'updatedAt', render: (date) => new Date(date).toLocaleDateString() },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => { setEditingContent(record); form.setFieldsValue(record); setIsModalVisible(true); }} 
            size="small"
          />
          {record.status !== 'PUBLISHED' && (
            <Button icon={<CheckCircleOutlined />} onClick={() => publishContent(record.id)} size="small" type="primary" ghost>Publish</Button>
          )}
          <Button icon={<DeleteOutlined />} danger onClick={() => deleteContent(record.id)} size="small" />
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>CMS Management</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingContent(null); form.resetFields(); setIsModalVisible(true); }}>
          Create Content
        </Button>
      </div>

      <Card bordered={false}>
        <Table 
          columns={columns} 
          dataSource={content} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 15 }}
        />
      </Card>

      <Modal
        title={editingContent ? 'Edit Content' : 'Create Content'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleAddEdit}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="URL Slug" rules={[{ required: true }]}>
            <Input addonBefore="/" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select>
              <Option value="PAGE">Page</Option>
              <Option value="BLOG">Blog Post</Option>
              <Option value="FAQ">FAQ</Option>
              <Option value="POLICY">Policy</Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="Content Body" rules={[{ required: true }]}>
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingContent ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminCmsDashboardPage;
