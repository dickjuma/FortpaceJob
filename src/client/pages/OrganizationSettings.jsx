import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, message, Typography, Tabs, Space, Tag, Switch } from 'antd';
import { SettingOutlined, SafetyCertificateOutlined, KeyOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../platform/common/services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const OrganizationSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [form] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [ssoForm] = Form.useForm();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/organization-settings');
      setSettings(res.data?.data || res.data || []);
    } catch (error) {
      message.error('Failed to load organization settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSetting = async (values) => {
    try {
      const payload = {
        ...values,
        value: JSON.parse(values.value || '{}')
      };
      await api.post('/api/organization-settings', payload);
      message.success('Setting created successfully');
      setIsModalVisible(false);
      form.resetFields();
      fetchSettings();
    } catch (error) {
      message.error('Failed to create setting. Ensure value is valid JSON.');
    }
  };

  const handleUpdateSecurity = async (values) => {
    try {
      const payload = {
        organizationId: values.organizationId,
        name: values.name,
        rules: JSON.parse(values.rules || '{}')
      };
      await api.post('/api/organization-settings/security', payload);
      message.success('Security policy updated successfully');
      securityForm.resetFields();
    } catch (error) {
      message.error('Failed to update security policy. Ensure rules are valid JSON.');
    }
  };

  const handleConfigureSso = async (values) => {
    try {
      await api.post('/api/organization-settings/sso', values);
      message.success('SSO configuration updated successfully');
      ssoForm.resetFields();
    } catch (error) {
      message.error('Failed to configure SSO');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/organization-settings/${id}`);
      message.success('Setting deleted successfully');
      fetchSettings();
    } catch (error) {
      message.error('Failed to delete setting');
    }
  };

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (val) => (
        <Text code>{JSON.stringify(val)}</Text>
      ),
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
        <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Organization Settings</Title>
      </div>

      <Tabs defaultActiveKey="general">
        <TabPane 
          tab={<span><SettingOutlined />General Settings</span>} 
          key="general"
        >
          <Card 
            bordered={false} 
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
                Add Setting
              </Button>
            }
          >
            <Table 
              dataSource={settings} 
              columns={columns} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane 
          tab={<span><SafetyCertificateOutlined />Security Policies</span>} 
          key="security"
        >
          <Card bordered={false} title="Update Security Policy">
            <Form form={securityForm} layout="vertical" onFinish={handleUpdateSecurity} style={{ maxWidth: '600px' }}>
              <Form.Item name="organizationId" label="Organization ID" rules={[{ required: true }]}>
                <Input placeholder="org-123" />
              </Form.Item>
              <Form.Item name="name" label="Policy Name" rules={[{ required: true }]}>
                <Input placeholder="Strict Device Policy" />
              </Form.Item>
              <Form.Item name="rules" label="Policy Rules (JSON)" rules={[{ required: true }]} initialValue="{}">
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Save Security Policy</Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>

        <TabPane 
          tab={<span><KeyOutlined />SSO Configuration</span>} 
          key="sso"
        >
          <Card bordered={false} title="Configure Single Sign-On (SSO)">
            <Form form={ssoForm} layout="vertical" onFinish={handleConfigureSso} style={{ maxWidth: '600px' }}>
              <Form.Item name="organizationId" label="Organization ID" rules={[{ required: true }]}>
                <Input placeholder="org-123" />
              </Form.Item>
              <Form.Item name="provider" label="SSO Provider" rules={[{ required: true }]}>
                <Select placeholder="Select Provider">
                  <Select.Option value="OKTA">Okta</Select.Option>
                  <Select.Option value="GOOGLE_WORKSPACE">Google Workspace</Select.Option>
                  <Select.Option value="AZURE_AD">Azure AD</Select.Option>
                  <Select.Option value="ONELOGIN">OneLogin</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="enabled" label="Enable SSO" valuePropName="checked" initialValue={false}>
                <Switch />
              </Form.Item>
              <Form.Item name="credentialsVerified" label="Credentials Verified" valuePropName="checked" initialValue={false}>
                <Switch />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">Save SSO Config</Button>
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>

      <Modal
        title="Add Organization Setting"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSetting}>
          <Form.Item name="organizationId" label="Organization ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="key" label="Setting Key" rules={[{ required: true }]}>
            <Input placeholder="e.g. max_users" />
          </Form.Item>
          <Form.Item name="value" label="Setting Value (JSON)" rules={[{ required: true }]} initialValue='{"limit": 50}'>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="ACTIVE">
            <Select>
              <Select.Option value="ACTIVE">Active</Select.Option>
              <Select.Option value="INACTIVE">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Create Setting</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrganizationSettings;
