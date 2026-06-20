import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Typography, Tabs, Space, Tag } from 'antd';
import { PlusOutlined, UsergroupAddOutlined, FolderAddOutlined } from '@ant-design/icons';
import api from '../../platform/common/services/api';

const { Title } = Typography;
const { TabPane } = Tabs;

const BusinessWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [activeTab, setActiveTab] = useState('workspaces');
  const [form] = Form.useForm();
  const [memberForm] = Form.useForm();
  const [resourceForm] = Form.useForm();

  const [isMemberModalVisible, setIsMemberModalVisible] = useState(false);
  const [isResourceModalVisible, setIsResourceModalVisible] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/business-workspaces');
      setWorkspaces(res.data?.data || res.data || []);
    } catch (error) {
      message.error('Failed to load workspaces');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (values) => {
    try {
      await api.post('/api/business-workspaces', values);
      message.success('Workspace created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchWorkspaces();
    } catch (error) {
      message.error('Failed to create workspace');
    }
  };

  const handleAddMember = async (values) => {
    try {
      await api.post(`/api/business-workspaces/${currentWorkspace.id}/members`, values);
      message.success('Member added successfully');
      setIsMemberModalVisible(false);
      memberForm.resetFields();
    } catch (error) {
      message.error('Failed to add member');
    }
  };

  const handleAddResource = async (values) => {
    try {
      await api.post(`/api/business-workspaces/${currentWorkspace.id}/resources`, values);
      message.success('Resource added successfully');
      setIsResourceModalVisible(false);
      resourceForm.resetFields();
    } catch (error) {
      message.error('Failed to add resource');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'default'}>{status || 'ACTIVE'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            ghost 
            onClick={() => {
              setCurrentWorkspace(record);
              setActiveTab('members');
            }}
          >
            Manage
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Business Workspaces</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
        >
          Create Workspace
        </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="All Workspaces" key="workspaces">
          <Card bordered={false}>
            <Table 
              dataSource={workspaces} 
              columns={columns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
        {currentWorkspace && (
          <TabPane tab={`Manage: ${currentWorkspace.name}`} key="members">
            <Card bordered={false} title="Workspace Members" extra={
              <Button icon={<UsergroupAddOutlined />} onClick={() => setIsMemberModalVisible(true)}>Add Member</Button>
            }>
              <Table 
                dataSource={currentWorkspace.members || []} 
                rowKey="id"
                columns={[
                  { title: 'User ID', dataIndex: 'userId', key: 'userId' },
                  { title: 'Role', dataIndex: 'role', key: 'role' },
                  { title: 'Access Level', dataIndex: 'accessLevel', key: 'accessLevel' },
                ]}
              />
            </Card>

            <Card bordered={false} title="Workspace Resources" style={{ marginTop: '24px' }} extra={
              <Button icon={<FolderAddOutlined />} onClick={() => setIsResourceModalVisible(true)}>Add Resource</Button>
            }>
              <Table 
                dataSource={currentWorkspace.resources || []} 
                rowKey="id"
                columns={[
                  { title: 'Name', dataIndex: 'name', key: 'name' },
                  { title: 'File ID', dataIndex: 'fileId', key: 'fileId' },
                  { title: 'Access Level', dataIndex: 'accessLevel', key: 'accessLevel' },
                ]}
              />
            </Card>
          </TabPane>
        )}
      </Tabs>

      <Modal
        title="Create Workspace"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateWorkspace}>
          <Form.Item name="name" label="Workspace Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="organizationId" label="Organization ID">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="ACTIVE">
            <Select>
              <Select.Option value="ACTIVE">Active</Select.Option>
              <Select.Option value="ARCHIVED">Archived</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Create</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Member"
        visible={isMemberModalVisible}
        onCancel={() => setIsMemberModalVisible(false)}
        footer={null}
      >
        <Form form={memberForm} layout="vertical" onFinish={handleAddMember}>
          <Form.Item name="userId" label="User ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Role" initialValue="MEMBER">
            <Select>
              <Select.Option value="OWNER">Owner</Select.Option>
              <Select.Option value="ADMIN">Admin</Select.Option>
              <Select.Option value="MEMBER">Member</Select.Option>
              <Select.Option value="GUEST">Guest</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="accessLevel" label="Access Level" initialValue="READ_WRITE">
            <Select>
              <Select.Option value="FULL">Full</Select.Option>
              <Select.Option value="READ_WRITE">Read & Write</Select.Option>
              <Select.Option value="READ_ONLY">Read Only</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Add Member</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add Resource"
        visible={isResourceModalVisible}
        onCancel={() => setIsResourceModalVisible(false)}
        footer={null}
      >
        <Form form={resourceForm} layout="vertical" onFinish={handleAddResource}>
          <Form.Item name="name" label="Resource Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fileId" label="File ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="accessLevel" label="Access Level" initialValue="SHARED">
            <Select>
              <Select.Option value="RESTRICTED">Restricted</Select.Option>
              <Select.Option value="SHARED">Shared</Select.Option>
              <Select.Option value="PUBLIC">Public</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Add Resource</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BusinessWorkspaces;
