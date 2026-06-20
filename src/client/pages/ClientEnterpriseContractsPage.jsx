import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Button, Tag, message, Modal, Form, Input, Select } from 'antd';
import { FileProtectOutlined, PlusOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import api from '../../platform/common/services/api';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const ClientEnterpriseContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/enterprise-contracts');
      setContracts(response.data?.data || response.data || []);
    } catch (error) {
      console.warn('Using fallback data for enterprise contracts', error);
      setContracts([
        { id: '1', title: 'Enterprise SOW - Q3 Dev', status: 'PENDING', value: '$50,000', startDate: '2026-07-01', endDate: '2026-09-30' },
        { id: '2', title: 'Master Services Agreement', status: 'ACTIVE', value: '$120,000', startDate: '2026-01-01', endDate: '2026-12-31' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await api.post('/api/enterprise-contracts', values);
      message.success('Enterprise contract requested');
      setIsModalVisible(false);
      form.resetFields();
      fetchContracts();
    } catch (error) {
      message.error('Failed to create contract');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/enterprise-contracts/${id}/approve`);
      message.success('Contract approved');
      fetchContracts();
    } catch (error) {
      message.error('Failed to approve contract');
    }
  };

  const handleRenew = async (id) => {
    try {
      await api.post(`/api/enterprise-contracts/${id}/renew`);
      message.success('Contract renewal initiated');
      fetchContracts();
    } catch (error) {
      message.error('Failed to renew contract');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      render: (status) => <Tag color={status === 'ACTIVE' ? 'green' : status === 'PENDING' ? 'orange' : 'blue'}>{status}</Tag> 
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'PENDING' && (
            <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record.id)}>
              Approve
            </Button>
          )}
          {record.status === 'ACTIVE' && (
            <Button size="small" icon={<SyncOutlined />} onClick={() => handleRenew(record.id)}>
              Renew
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            <FileProtectOutlined style={{ marginRight: '12px' }} />
            Enterprise Contracts
          </Title>
          <Paragraph>Manage your Master Service Agreements (MSAs) and Statements of Work (SOWs).</Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          New Contract
        </Button>
      </div>

      <Card bordered={false}>
        <Table 
          columns={columns} 
          dataSource={contracts} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Request New Enterprise Contract"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="title" label="Contract Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Contract Type" rules={[{ required: true }]}>
            <Select>
              <Option value="MSA">Master Services Agreement (MSA)</Option>
              <Option value="SOW">Statement of Work (SOW)</Option>
            </Select>
          </Form.Item>
          <Form.Item name="value" label="Estimated Value" rules={[{ required: true }]}>
            <Input type="number" prefix="$" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientEnterpriseContractsPage;
