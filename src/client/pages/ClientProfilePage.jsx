import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, Switch, Row, Col, Card, Typography, Divider, Spin, Tabs } from 'antd';
import { UploadOutlined, UserOutlined, BuildOutlined, SettingOutlined, LinkOutlined } from '@ant-design/icons';
import { useMyProfile, useUpdateProfile } from '../services/clientHooks';
import api from '../../platform/common/services/api';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ClientProfilePage = () => {
  const [form] = Form.useForm();
  const [clientType, setClientType] = useState('INDIVIDUAL');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/profilesystem/client/setup');
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setProfile(data);
        
        let resolvedType = 'INDIVIDUAL';
        // Basic fallback for legacy
        if (data.companyName || ['BUSINESS', 'SME', 'CORPORATE'].includes(String(data.accountType).toUpperCase())) {
          resolvedType = 'BUSINESS';
        }
        setClientType(resolvedType);
        
        form.setFieldsValue({
          clientType: resolvedType,
          headline: data.headline,
          bio: data.bio,
          country: data.country,
          city: data.city,
          state: data.state,
          timezone: data.timezone,
          language: data.language,
          website: data.website,
          linkedin: data.linkedin,
          twitter: data.twitter,
          facebook: data.facebook,
          profileVisibility: data.profileVisibility || 'PUBLIC',
          allowMessages: data.allowMessages !== false,
          allowInvitations: data.allowInvitations !== false,
          allowSearchListing: data.allowSearchListing !== false,
          companyName: data.companyName,
          registrationNumber: data.registrationNumber,
          companySize: data.companySize,
        });
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      setSaving(true);
      await api.put('/api/profilesystem/client/setup', values);
      fetchProfile();
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClientTypeChange = (value) => {
    setClientType(value);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  const isBusiness = clientType === 'BUSINESS';

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Update Your Profile</Title>
        <Text type="secondary">Manage your client profile, preferences, and account type.</Text>
      </div>

      <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab={<span><UserOutlined /> Basic Info</span>} key="1">
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item name="clientType" label="Account Type" rules={[{ required: true }]}>
                    <Select onChange={handleClientTypeChange}>
                      <Option value="INDIVIDUAL">Individual Client (Personal Projects)</Option>
                      <Option value="BUSINESS">Business Client (Company / Agency)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="language" label="Primary Language">
                    <Input placeholder="E.g., English" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={24}>
                  <Form.Item name="headline" label="Professional Headline" rules={[{ required: true }]}>
                    <Input placeholder="E.g., Senior Project Manager" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="bio" label="Biography / About You">
                <TextArea rows={4} placeholder="Tell freelancers about yourself or your organization..." />
              </Form.Item>

              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <Form.Item name="country" label="Country">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="state" label="State/Region">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item name="city" label="City">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item name="timezone" label="Timezone">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Profile Photo / Avatar">
                <Upload maxCount={1}>
                  <Button icon={<UploadOutlined />}>Click to Upload Photo</Button>
                </Upload>
              </Form.Item>
            </TabPane>

            {isBusiness && (
              <TabPane tab={<span><BuildOutlined /> Company Details</span>} key="2">
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
                      <Input placeholder="Enter your company name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name="registrationNumber" label="Registration / EIN Number">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col xs={24} md={12}>
                    <Form.Item name="companySize" label="Company Size">
                      <Select>
                        <Option value="1-10">1 - 10 employees</Option>
                        <Option value="11-50">11 - 50 employees</Option>
                        <Option value="51-200">51 - 200 employees</Option>
                        <Option value="201+">201+ employees</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Company Logo">
                  <Upload maxCount={1}>
                    <Button icon={<UploadOutlined />}>Upload Company Logo</Button>
                  </Upload>
                </Form.Item>
              </TabPane>
            )}

            <TabPane tab={<span><LinkOutlined /> Social & Web</span>} key="4">
               <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item name="website" label="Website URL">
                    <Input placeholder="https://yourwebsite.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="linkedin" label="LinkedIn URL">
                    <Input placeholder="https://linkedin.com/in/username" />
                  </Form.Item>
                </Col>
              </Row>
               <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item name="twitter" label="Twitter URL">
                    <Input placeholder="https://twitter.com/username" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="facebook" label="Facebook URL">
                    <Input placeholder="https://facebook.com/username" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab={<span><SettingOutlined /> Settings</span>} key="3">
              <Form.Item name="profileVisibility" label="Profile Visibility">
                <Select>
                  <Option value="PUBLIC">Public</Option>
                  <Option value="PRIVATE">Private</Option>
                </Select>
              </Form.Item>
              <Form.Item name="allowMessages" label="Allow Direct Messages" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="allowInvitations" label="Allow Freelancer Invitations" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item name="allowSearchListing" label="List in Client Directory" valuePropName="checked">
                <Switch />
              </Form.Item>
            </TabPane>
          </Tabs>

          <Divider />

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={saving}>
              Save Profile Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ClientProfilePage;
