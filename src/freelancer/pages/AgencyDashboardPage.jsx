import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Form, Input, Typography, Table, Tag, Skeleton, Alert, message, Modal } from 'antd';
import { TeamOutlined, UserAddOutlined, SolutionOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../platform/common/services/api';

const { Title, Text } = Typography;

export default function AgencyDashboardPage() {
  const queryClient = useQueryClient();
  const [inviteModal, setInviteModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [inviteForm] = Form.useForm();
  const [createForm] = Form.useForm();

  const { data: agencies, isLoading, isError, error } = useQuery({
    queryKey: ['agencies'],
    queryFn: async () => {
      const res = await api.get('/api/agencies');
      return res.data.data || [];
    }
  });

  const createAgencyMutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        name: values.name,
        organizationId: `ORG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        ownerId: 'current-user-id', // Would ideally come from auth context
      };
      const res = await api.post('/api/agencies', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agencies']);
      setCreateModal(false);
      createForm.resetFields();
      message.success('Agency created successfully.');
    },
    onError: (e) => {
      message.error(e.response?.data?.error || 'Failed to create agency.');
    }
  });

  const inviteMutation = useMutation({
    mutationFn: async ({ agencyId, email }) => {
      const res = await api.post(`/api/agencies/${agencyId}/invites`, { email });
      return res.data;
    },
    onSuccess: () => {
      setInviteModal(false);
      inviteForm.resetFields();
      message.success('Invite sent successfully.');
    },
    onError: (e) => {
      message.error(e.response?.data?.error || 'Failed to send invite.');
    }
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton active title paragraph={{ rows: 2 }} />
        <Skeleton active title paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <Alert type="error" message="Failed to load agencies" description={error?.message || 'Network error'} />
      </div>
    );
  }

  const myAgency = agencies?.[0]; // Get the first agency assigned to this user

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#4C1D95]/10 rounded-2xl flex items-center justify-center text-[#4C1D95]">
            <TeamOutlined style={{ fontSize: '24px' }} />
          </div>
          <div>
            <Title level={2} className="!m-0 text-gray-900 dark:text-white">Agency Dashboard</Title>
            <Text type="secondary">Manage your agency roster, team permissions, and workspace.</Text>
          </div>
        </div>
        {!myAgency && (
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setCreateModal(true)}>
            Create Agency
          </Button>
        )}
      </div>

      {!myAgency ? (
        <Card className="text-center py-12 rounded-[24px] border-dashed border-gray-300 dark:border-gray-700 bg-transparent">
          <SolutionOutlined className="text-6xl text-gray-300 dark:text-gray-600 mb-4" />
          <Title level={3} className="!mb-2">You don't have an Agency yet</Title>
          <Text type="secondary" className="block mb-6">Create an agency to collaborate with other freelancers, share a portfolio, and take on enterprise contracts.</Text>
          <Button type="primary" size="large" onClick={() => setCreateModal(true)}>
            Setup My Agency
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card title="Agency Details" bordered={false} className="shadow-sm rounded-[24px]">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <TeamOutlined style={{ fontSize: '40px', color: '#ccc' }} />
                </div>
                <Title level={4} className="!m-0">{myAgency.name}</Title>
                <Tag color="purple" className="mt-2 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">Active</Tag>
              </div>
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex justify-between">
                  <Text type="secondary">Organization ID</Text>
                  <Text strong>{myAgency.organizationId}</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">Created</Text>
                  <Text strong>{new Date(myAgency.createdAt || Date.now()).toLocaleDateString()}</Text>
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Card 
              title="Team Roster" 
              bordered={false} 
              className="shadow-sm rounded-[24px]"
              extra={
                <Button type="primary" icon={<UserAddOutlined />} onClick={() => setInviteModal(true)}>
                  Invite Member
                </Button>
              }
            >
              <Table 
                dataSource={[]} 
                locale={{ emptyText: 'No team members yet. Invite someone to join your agency.' }}
                columns={[
                  { title: 'Member', dataIndex: 'name', key: 'name' },
                  { title: 'Role', dataIndex: 'role', key: 'role' },
                  { title: 'Status', dataIndex: 'status', key: 'status' },
                ]}
                pagination={false}
              />
            </Card>
          </div>
        </div>
      )}

      {/* Create Agency Modal */}
      <Modal
        title="Create a New Agency"
        open={createModal}
        onCancel={() => setCreateModal(false)}
        footer={null}
      >
        <Form form={createForm} layout="vertical" onFinish={(v) => createAgencyMutation.mutate(v)}>
          <Alert className="mb-4" type="info" showIcon message="Setting up an agency allows you to bid on enterprise contracts as a unified team." />
          <Form.Item name="name" label="Agency Name" rules={[{ required: true }]}>
            <Input size="large" placeholder="E.g. Creative Flow Studio" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={createAgencyMutation.isPending}>
              Create Agency
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Invite Modal */}
      <Modal
        title="Invite Team Member"
        open={inviteModal}
        onCancel={() => setInviteModal(false)}
        footer={null}
      >
        <Form form={inviteForm} layout="vertical" onFinish={(v) => inviteMutation.mutate({ agencyId: myAgency?.id, email: v.email })}>
          <Form.Item name="email" label="Email Address" rules={[{ required: true, type: 'email' }]}>
            <Input size="large" placeholder="colleague@example.com" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setInviteModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={inviteMutation.isPending}>
              Send Invite
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
