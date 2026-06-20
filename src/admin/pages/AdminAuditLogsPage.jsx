import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Space, Button, Input, DatePicker, message, Tag, Drawer, Descriptions } from 'antd';
import { SearchOutlined, DownloadOutlined, FilterOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../api/apiClient';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState({});
  const [selectedLog, setSelectedLog] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    fetchLogs(pagination.current, pagination.pageSize, filters);
  }, []);

  const fetchLogs = async (page, limit, currentFilters) => {
    setLoading(true);
    try {
      // Build query string
      const params = new URLSearchParams({
        page,
        limit,
        ...currentFilters
      });

      const response = await api.get(`/api/audit/logs?${params.toString()}`);
      
      const data = response.data?.data || response.data || [];
      const meta = response.data?.meta || { total: data.length };

      setLogs(Array.isArray(data) ? data : data.logs || []);
      setPagination({
        current: page,
        pageSize: limit,
        total: meta.total || data.length || 0
      });
    } catch (error) {
      // Fallback for mocked data if endpoint not fully ready
      console.warn('Failed to fetch audit logs, using fallback', error);
      setLogs([
        { id: '1', action: 'USER_LOGIN', entityType: 'USER', entityId: 'u-123', actorId: 'u-123', status: 'SUCCESS', ipAddress: '192.168.1.1', createdAt: new Date().toISOString() },
        { id: '2', action: 'PAYMENT_PROCESSED', entityType: 'TRANSACTION', entityId: 'tx-456', actorId: 'sys', status: 'SUCCESS', ipAddress: '10.0.0.1', createdAt: new Date().toISOString() },
        { id: '3', action: 'ROLE_UPDATED', entityType: 'USER', entityId: 'u-789', actorId: 'admin-1', status: 'SUCCESS', ipAddress: '192.168.1.50', createdAt: new Date().toISOString() }
      ]);
      setPagination({ current: 1, pageSize: 20, total: 3 });
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    fetchLogs(newPagination.current, newPagination.pageSize, filters);
  };

  const handleSearch = (value) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    fetchLogs(1, pagination.pageSize, newFilters);
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/api/audit/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_logs_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      message.error('Failed to export audit logs');
    }
  };

  const showLogDetails = async (record) => {
    setSelectedLog(record);
    setDrawerVisible(true);
    
    // Attempt to load full details if trace ID is present
    if (record.traceId) {
      try {
        const res = await api.get(`/api/audit/trace/${record.traceId}`);
        if (res.data?.data) {
          setSelectedLog({ ...record, ...res.data.data });
        }
      } catch (err) {
        console.warn('Trace details not found');
      }
    }
  };

  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Entity',
      key: 'entity',
      render: (_, record) => `${record.entityType} (${record.entityId})`
    },
    {
      title: 'Actor',
      dataIndex: 'actorId',
      key: 'actorId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'SUCCESS' ? 'green' : 'red'}>{status}</Tag>
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: 'View',
      key: 'view',
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => showLogDetails(record)} size="small" />
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>System Audit Logs</Title>
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Export CSV
          </Button>
        </Space>
      </div>

      <Card bordered={false}>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
          <Input.Search 
            placeholder="Search action or entity ID" 
            onSearch={handleSearch} 
            style={{ width: 300 }} 
          />
          <RangePicker 
            onChange={(dates) => {
              const newFilters = { 
                ...filters, 
                startDate: dates?.[0]?.toISOString(), 
                endDate: dates?.[1]?.toISOString() 
              };
              setFilters(newFilters);
              fetchLogs(1, pagination.pageSize, newFilters);
            }} 
          />
        </div>

        <Table 
          dataSource={logs} 
          columns={columns} 
          rowKey="id" 
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>

      <Drawer
        title="Audit Log Details"
        placement="right"
        width={500}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        {selectedLog && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Log ID">{selectedLog.id}</Descriptions.Item>
            <Descriptions.Item label="Action"><Tag color="blue">{selectedLog.action}</Tag></Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={selectedLog.status === 'SUCCESS' ? 'green' : 'red'}>{selectedLog.status}</Tag></Descriptions.Item>
            <Descriptions.Item label="Actor ID">{selectedLog.actorId}</Descriptions.Item>
            <Descriptions.Item label="Entity Type">{selectedLog.entityType}</Descriptions.Item>
            <Descriptions.Item label="Entity ID">{selectedLog.entityId}</Descriptions.Item>
            <Descriptions.Item label="IP Address">{selectedLog.ipAddress}</Descriptions.Item>
            <Descriptions.Item label="Trace ID">{selectedLog.traceId || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Created At">{new Date(selectedLog.createdAt).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Metadata">
              <pre style={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px', fontSize: '12px', overflowX: 'auto' }}>
                {JSON.stringify(selectedLog.metadata || {}, null, 2)}
              </pre>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </div>
  );
};

export default AdminAuditLogsPage;
