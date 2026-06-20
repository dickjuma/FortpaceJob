import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Upload, Select, Card, Typography, Alert, message } from 'antd';
import { UploadOutlined, BankOutlined, FileDoneOutlined } from '@ant-design/icons';
import { useSubmitBusinessVerification } from '../hooks/useVerification';

const { Title, Text } = Typography;
const { Option } = Select;

export default function BusinessVerificationFlow() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutateAsync: submitVerification, isPending } = useSubmitBusinessVerification();
  const [fileList, setFileList] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values) => {
    try {
      if (fileList.length === 0) {
        message.error('Please upload at least one registration document.');
        return;
      }

      // Map to backend payload structure
      const payload = {
        companyName: values.companyName,
        registrationNumber: values.registrationNumber,
        companyType: values.companyType,
        jurisdiction: values.jurisdiction,
        // In a real implementation, we'd upload the file to S3/Cloudinary first and get a URL.
        // Mocking the document URL for the backend structure.
        documents: fileList.map(f => ({ url: 'mock-url.pdf', type: f.name })),
        status: 'PENDING'
      };

      await submitVerification(payload);
      setSubmitted(true);
      message.success('Business verification submitted successfully!');
    } catch (error) {
      message.error(error.response?.data?.error || 'Failed to submit verification');
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="text-center py-12 shadow-sm rounded-2xl border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileDoneOutlined style={{ fontSize: '32px' }} />
          </div>
          <Title level={2}>Submission Received</Title>
          <Text type="secondary" className="block mb-8 text-lg">
            Your business verification request is now under review. We will notify you within 24-48 hours once our compliance team has verified your documents.
          </Text>
          <Button type="primary" size="large" onClick={() => navigate('/verification')}>
            Return to Verification Center
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#4C1D95]/10 rounded-xl flex items-center justify-center text-[#4C1D95]">
          <BankOutlined style={{ fontSize: '24px' }} />
        </div>
        <div>
          <Title level={2} style={{ margin: 0 }}>Business Verification</Title>
          <Text type="secondary">Provide your official company details and registration documents.</Text>
        </div>
      </div>

      <Card bordered={false} className="shadow-sm rounded-2xl">
        <Alert
          message="Why do we need this?"
          description="To unlock Agency features, Escrow wallets, and Enterprise contracts, Fortspace requires verified proof of business registration in accordance with KYC/AML regulations."
          type="info"
          showIcon
          className="mb-8"
        />

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark="optional"
        >
          <Form.Item
            name="companyName"
            label="Legal Company Name"
            rules={[{ required: true, message: 'Please enter your company name' }]}
          >
            <Input size="large" placeholder="E.g., Acme Corporation Ltd." />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="registrationNumber"
              label="Registration Number (EIN, CRN, etc.)"
              rules={[{ required: true, message: 'Please enter your registration number' }]}
            >
              <Input size="large" placeholder="E.g., 12-3456789" />
            </Form.Item>

            <Form.Item
              name="companyType"
              label="Company Type"
              rules={[{ required: true, message: 'Please select company type' }]}
            >
              <Select size="large" placeholder="Select type">
                <Option value="LLC">LLC / Limited Liability</Option>
                <Option value="INC">Incorporated / C-Corp</Option>
                <Option value="PARTNERSHIP">Partnership</Option>
                <Option value="SOLE_PROPRIETOR">Sole Proprietorship</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="jurisdiction"
            label="State / Country of Registration"
            rules={[{ required: true, message: 'Please enter jurisdiction' }]}
          >
            <Input size="large" placeholder="E.g., Delaware, USA" />
          </Form.Item>

          <Form.Item
            name="documents"
            label="Registration Documents"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra="Upload your Certificate of Incorporation, Business License, or equivalent. (PDF, JPG, PNG)"
            rules={[{ required: true, message: 'Please upload at least one document' }]}
          >
            <Upload
              name="document"
              listType="picture"
              beforeUpload={() => false} // Prevent auto upload
              onChange={(info) => setFileList(info.fileList)}
            >
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>

          <div className="pt-6 border-t border-gray-100 mt-8 flex justify-end gap-4">
            <Button size="large" onClick={() => navigate('/verification')}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large" loading={isPending}>
              Submit for Review
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
