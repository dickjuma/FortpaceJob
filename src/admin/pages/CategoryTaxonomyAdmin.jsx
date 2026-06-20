import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Typography, Tabs, Space, Tag, InputNumber } from 'antd';
import { PlusOutlined, UnorderedListOutlined, RiseOutlined } from '@ant-design/icons';
import api from '../api/apiClient';

const { Title } = Typography;
const { TabPane } = Tabs;

const CategoryTaxonomyAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isSkillModalVisible, setIsSkillModalVisible] = useState(false);
  
  const [categoryForm] = Form.useForm();
  const [skillForm] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const catRes = await api.get('/api/category-taxonomy/categories');
      const skillRes = await api.get('/api/category-taxonomy/skills');
      
      setCategories(catRes.data?.data || catRes.data || []);
      setSkills(skillRes.data?.data || skillRes.data || []);
    } catch (error) {
      // It's possible the endpoints might return differently structured data or 404 if not implemented perfectly
      console.warn('Could not load some taxonomy data', error);
      // Fallback to empty array to prevent crashing
      if (!categories.length) setCategories([]);
      if (!skills.length) setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (values) => {
    try {
      await api.post('/api/category-taxonomy/admin/categories', values);
      message.success('Category created successfully');
      setIsCategoryModalVisible(false);
      categoryForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('Failed to create category');
    }
  };

  const handleCreateSkill = async (values) => {
    try {
      await api.post('/api/category-taxonomy/admin/skills', values);
      message.success('Skill created successfully');
      setIsSkillModalVisible(false);
      skillForm.resetFields();
      fetchData();
    } catch (error) {
      message.error('Failed to create skill');
    }
  };

  const handleRefreshTrending = async () => {
    try {
      await api.post('/api/category-taxonomy/admin/refresh/trending-skills');
      message.success('Trending skills refreshed');
    } catch (error) {
      message.error('Failed to refresh trending skills');
    }
  };

  const categoryColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => <Tag color={type === 'ONLINE' ? 'blue' : 'green'}>{type || 'MIXED'}</Tag>,
    },
  ];

  const skillColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Category & Taxonomy Management</Title>
        <Space>
          <Button icon={<RiseOutlined />} onClick={handleRefreshTrending}>
            Refresh Trending
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCategoryModalVisible(true)}>
            Add Category
          </Button>
        </Space>
      </div>

      <Tabs defaultActiveKey="categories">
        <TabPane tab={<span><UnorderedListOutlined />Categories</span>} key="categories">
          <Card bordered={false}>
            <Table 
              dataSource={categories} 
              columns={categoryColumns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab={<span><UnorderedListOutlined />Skills</span>} key="skills">
          <Card 
            bordered={false} 
            extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsSkillModalVisible(true)}>Add Skill</Button>}
          >
            <Table 
              dataSource={skills} 
              columns={skillColumns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title="Create Category"
        visible={isCategoryModalVisible}
        onCancel={() => setIsCategoryModalVisible(false)}
        footer={null}
      >
        <Form form={categoryForm} layout="vertical" onFinish={handleCreateCategory}>
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Work Mode Type" initialValue="MIXED">
            <Select>
              <Select.Option value="ONLINE">Online (Remote)</Select.Option>
              <Select.Option value="LOCAL">Local (On-Site)</Select.Option>
              <Select.Option value="MIXED">Mixed / Hybrid</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Create Category</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Create Skill"
        visible={isSkillModalVisible}
        onCancel={() => setIsSkillModalVisible(false)}
        footer={null}
      >
        <Form form={skillForm} layout="vertical" onFinish={handleCreateSkill}>
          <Form.Item name="name" label="Skill Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="categoryId" label="Category">
            <Select showSearch>
              {categories.map(cat => (
                <Select.Option key={cat.id || cat.slug} value={cat.id || cat.slug}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Skill Type" initialValue="HARD">
            <Select>
              <Select.Option value="HARD">Hard Skill</Select.Option>
              <Select.Option value="SOFT">Soft Skill</Select.Option>
              <Select.Option value="TOOL">Tool / Software</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Create Skill</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryTaxonomyAdmin;
