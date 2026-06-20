import React, { useEffect, useState } from 'react';
import { Steps, Button, Form, Input, Select, Switch, Upload, message, Card, Typography, Row, Col, Divider, Space } from 'antd';
import { UploadOutlined, VideoCameraOutlined, CheckCircleOutlined } from '@ant-design/icons';
import useClientWizardStore from '../store/useClientWizardStore';
import api from '../../platform/common/services/api';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ClientSetupWizard = () => {
  const { step, setStep, nextStep, prevStep, data, updateData, updateNestedData } = useClientWizardStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const steps = [
    { title: 'Personal Info' },
    { title: 'Profile Media' },
    { title: 'Professional Info' },
    { title: 'Industry & Taxonomy' },
    { title: 'Hiring Preferences' },
    { title: 'Budget Preferences' },
    { title: 'Communication' },
    { title: 'Social & Web' },
    { title: 'Billing Info' },
    { title: 'Verification' },
    { title: 'Security' },
    { title: 'Privacy Settings' },
    { title: 'Notifications' }
  ];

  useEffect(() => {
    // Populate form fields with current data
    if (step === 0) form.setFieldsValue({ country: data.country, state: data.state, city: data.city, timezone: data.timezone, language: data.language });
    if (step === 1) form.setFieldsValue({ profilePhoto: data.profilePhoto, coverPhoto: data.coverPhoto, introVideo: data.introVideo });
    if (step === 2) form.setFieldsValue({ headline: data.headline, bio: data.bio });
    if (step === 3) form.setFieldsValue(data.industries);
    if (step === 4) form.setFieldsValue(data.hiringPreferences);
    if (step === 5) form.setFieldsValue(data.hiringPreferences); // budget is in hiringPreferences
    if (step === 6) form.setFieldsValue(data.hiringPreferences); // communication can go in hiringPreferences or data
    if (step === 7) form.setFieldsValue({ website: data.website, linkedin: data.linkedin, twitter: data.twitter, facebook: data.facebook });
    // etc...
  }, [step, data, form]);

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      if (step === 0) updateData(values);
      if (step === 1) updateData(values);
      if (step === 2) updateData(values);
      if (step === 3) updateNestedData('industries', values);
      if (step === 4 || step === 5 || step === 6) updateNestedData('hiringPreferences', values);
      if (step === 7) updateData(values);
      // step 8 is billing (maybe skip for now)
      // step 9 is verification
      if (step === 10) updateNestedData('securitySettings', values);
      if (step === 11) updateData(values);
      if (step === 12) updateNestedData('notificationSettings', values);

      if (step === steps.length - 1) {
        submitWizard();
      } else {
        nextStep();
      }
    } catch (err) {
      console.log('Validation failed:', err);
    }
  };

  const submitWizard = async () => {
    setLoading(true);
    try {
      const res = await api.put('/api/profilesystem/client/setup', data);
      if (res.data.success) {
        message.success('Profile created successfully!');
        navigate('/client/profile');
      } else {
        message.error(res.data.error || 'Failed to save profile');
      }
    } catch (err) {
      message.error(err.response?.data?.error || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file, field) => {
    // Mock upload for now, ideally upload to Cloudinary
    const fakeUrl = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
    updateData({ [field]: fakeUrl });
    message.success('Uploaded successfully (mock)');
    return false; // prevent default upload
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Personal Information</Title>
            <Form.Item name="country" label="Country" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item name="state" label="State/Region"><Input /></Form.Item>
            <Form.Item name="city" label="City"><Input /></Form.Item>
            <Form.Item name="timezone" label="Timezone"><Input /></Form.Item>
            <Form.Item name="language" label="Primary Language"><Input /></Form.Item>
          </Space>
        );
      case 1:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Profile Media</Title>
            <Text type="secondary">Adding media increases freelancer trust by up to 40%.</Text>
            <Divider />
            <Form.Item label="Profile Photo">
              <Upload beforeUpload={(f) => handleUpload(f, 'profilePhoto')} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Upload Avatar</Button>
              </Upload>
              {data.profilePhoto && <Text type="success" style={{ marginLeft: 10 }}><CheckCircleOutlined /> Uploaded</Text>}
            </Form.Item>
            <Form.Item label="Cover Photo">
              <Upload beforeUpload={(f) => handleUpload(f, 'coverPhoto')} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Upload Cover</Button>
              </Upload>
              {data.coverPhoto && <Text type="success" style={{ marginLeft: 10 }}><CheckCircleOutlined /> Uploaded</Text>}
            </Form.Item>
            <Form.Item label="Intro Video">
              <Text type="secondary">Maximum file size: 50MB. Mp4 format recommended.</Text><br/>
              <Upload beforeUpload={(f) => handleUpload(f, 'introVideo')} showUploadList={false} accept="video/*">
                <Button icon={<VideoCameraOutlined />}>Upload Video</Button>
              </Upload>
              {data.introVideo && <Text type="success" style={{ marginLeft: 10 }}><CheckCircleOutlined /> Uploaded</Text>}
            </Form.Item>
          </Space>
        );
      case 2:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Professional Info</Title>
            <Form.Item name="headline" label="Headline" rules={[{ required: true }]}><Input placeholder="E.g., Senior Tech Founder looking for designers" /></Form.Item>
            <Form.Item name="bio" label="Bio/About Me" rules={[{ required: true }]}><TextArea rows={4} /></Form.Item>
          </Space>
        );
      case 3:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Industry & Taxonomy</Title>
            <Form.Item name="primaryIndustryId" label="Primary Industry"><Input placeholder="E.g. Technology, Real Estate" /></Form.Item>
            <Form.Item name="secondaryIndustryId" label="Secondary Industry"><Input /></Form.Item>
          </Space>
        );
      case 4:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Hiring Preferences</Title>
            <Form.Item name="hiringFrequency" label="Hiring Frequency">
              <Select>
                <Option value="ONE_TIME">One-time project</Option>
                <Option value="OCCASIONAL">Occasional</Option>
                <Option value="REGULAR">Regularly hiring</Option>
              </Select>
            </Form.Item>
            <Form.Item name="preferredTalentType" label="Preferred Talent Type">
              <Select>
                <Option value="INDIVIDUAL">Individuals</Option>
                <Option value="AGENCY">Agencies</Option>
                <Option value="BOTH">Both</Option>
              </Select>
            </Form.Item>
            <Form.Item name="preferredWorkType" label="Preferred Work Type">
              <Select>
                <Option value="REMOTE">Remote</Option>
                <Option value="LOCAL">Local / On-site</Option>
                <Option value="HYBRID">Hybrid</Option>
              </Select>
            </Form.Item>
          </Space>
        );
      case 5:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Budget Preferences</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="minimumBudget" label="Minimum Budget (USD)"><Input type="number" /></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="maximumBudget" label="Maximum Budget (USD)"><Input type="number" /></Form.Item>
              </Col>
            </Row>
          </Space>
        );
      case 6:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Communication Preferences</Title>
            <Paragraph>How do you prefer freelancers to contact you?</Paragraph>
            <Form.Item name="preferredCommunication" label="Primary Channel">
              <Select>
                <Option value="CHAT">Platform Chat</Option>
                <Option value="VIDEO">Video Call</Option>
                <Option value="EMAIL">Email</Option>
              </Select>
            </Form.Item>
          </Space>
        );
      case 7:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Social & Web Presence</Title>
            <Form.Item name="website" label="Website"><Input /></Form.Item>
            <Form.Item name="linkedin" label="LinkedIn URL"><Input /></Form.Item>
            <Form.Item name="twitter" label="Twitter URL"><Input /></Form.Item>
          </Space>
        );
      case 8:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Billing Info</Title>
            <Paragraph>We will skip this for now. You can add your payment method securely via the wallet later.</Paragraph>
          </Space>
        );
      case 9:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Verification Center</Title>
            <Paragraph>Your account verification starts here.</Paragraph>
            <Button type="primary" ghost>Verify Email (Already Sent)</Button>
            <Button type="primary" ghost style={{ marginLeft: 10 }}>Add Phone Number</Button>
          </Space>
        );
      case 10:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Security</Title>
            <Form.Item name="twoFactorEnabled" label="Enable 2FA" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item name="loginAlerts" label="Login Alerts" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item name="recoveryEmail" label="Recovery Email"><Input /></Form.Item>
          </Space>
        );
      case 11:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Privacy Settings</Title>
            <Form.Item name="profileVisibility" label="Profile Visibility">
              <Select>
                <Option value="PUBLIC">Public</Option>
                <Option value="PRIVATE">Private</Option>
              </Select>
            </Form.Item>
            <Form.Item name="allowMessages" label="Allow Direct Messages" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item name="allowInvitations" label="Allow Invitations" valuePropName="checked"><Switch /></Form.Item>
          </Space>
        );
      case 12:
        return (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Notifications</Title>
            <Form.Item name="emailNotifications" label="Email Notifications" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item name="pushNotifications" label="Push Notifications" valuePropName="checked"><Switch /></Form.Item>
            <Form.Item name="marketing" label="Marketing Updates" valuePropName="checked"><Switch /></Form.Item>
          </Space>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <Row gutter={32}>
        <Col span={6}>
          <Card bordered={false} style={{ height: '100%' }}>
            <Steps direction="vertical" current={step} items={steps.map(s => ({ title: s.title }))} />
          </Card>
        </Col>
        <Col span={18}>
          <Card bordered={false} style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <Form form={form} layout="vertical">
                {renderStepContent()}
              </Form>
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button disabled={step === 0} onClick={prevStep}>Back</Button>
              <Button type="primary" onClick={handleNext} loading={loading}>
                {step === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClientSetupWizard;
