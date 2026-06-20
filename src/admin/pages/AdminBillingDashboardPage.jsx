import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Tabs, Space, Button, message, Tag } from 'antd';
import { SyncOutlined, FileTextOutlined, ExceptionOutlined } from '@ant-design/icons';
import api from '../api/apiClient';

const { Title, Paragraph } = Typography;

const AdminBillingDashboardPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [quotationsRes, invoicesRes] = await Promise.allSettled([
        api.get('/api/billing/quotations/admin/all'),
        api.get('/api/billing/invoices')
      ]);

      if (quotationsRes.status === 'fulfilled') {
        const qData = quotationsRes.value.data?.data || [];
        setQuotations(Array.isArray(qData) ? qData : []);
      }
      if (invoicesRes.status === 'fulfilled') {
        const iData = invoicesRes.value.data?.data || [];
        setInvoices(Array.isArray(iData) ? iData : []);
      }
    } catch (error) {
      message.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const quotationColumns = [
    { title: 'Quotation No.', dataIndex: 'quotationNumber', key: 'quotationNumber' },
    { title: 'Freelancer', key: 'freelancer', render: (_, record) => `${record.freelancer?.firstName || ''} ${record.freelancer?.lastName || ''}` },
    { title: 'Client', key: 'client', render: (_, record) => `${record.client?.firstName || ''} ${record.client?.lastName || ''}` },
    { title: 'Total', dataIndex: 'total', key: 'total', render: (total) => `$${total}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color="blue">{status}</Tag> },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
  ];

  const invoiceColumns = [
    { title: 'Invoice No.', dataIndex: 'id', key: 'id' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => `$${amount}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Paid' ? 'green' : 'orange'}>{status}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Billing Dashboard</Title>
          <Paragraph>System-wide overview of invoices and quotations.</Paragraph>
        </div>
        <Button icon={<SyncOutlined />} onClick={fetchData} loading={loading}>
          Refresh
        </Button>
      </div>

      <Card bordered={false}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={<span><FileTextOutlined />Invoices</span>} key="1">
            <Table 
              columns={invoiceColumns} 
              dataSource={invoices} 
              rowKey="dbId" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span><ExceptionOutlined />Quotations</span>} key="2">
            <Table 
              columns={quotationColumns} 
              dataSource={quotations} 
              rowKey="id" 
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminBillingDashboardPage;
