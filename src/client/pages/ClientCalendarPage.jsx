import React, { useState, useEffect } from 'react';
import { Card, Calendar, Badge, Modal, Form, Input, DatePicker, TimePicker, Button, message, List, Typography, Space, Popconfirm } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../platform/common/services/api';
import moment from 'moment';

const { Title, Text } = Typography;

const ClientCalendarPage = () => {
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCalendarData();
  }, [selectedDate]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const [slotsRes, bookingsRes] = await Promise.all([
        api.get('/api/calendar/slots'),
        api.get('/api/calendar/bookings')
      ]);
      setSlots(slotsRes.data?.data || slotsRes.data || []);
      setBookings(bookingsRes.data?.data || bookingsRes.data || []);
    } catch (error) {
      console.warn('Using fallback data for calendar', error);
      // Fallback data
      setBookings([
        { id: 1, title: 'Project Kickoff', start: moment().add(1, 'days').toISOString(), end: moment().add(1, 'days').add(1, 'hours').toISOString(), status: 'CONFIRMED' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getListData = (value) => {
    const listData = [];
    bookings.forEach(b => {
      if (moment(b.start).isSame(value, 'day')) {
        listData.push({ type: 'success', content: b.title || 'Meeting' });
      }
    });
    slots.forEach(s => {
      if (moment(s.startTime).isSame(value, 'day')) {
        listData.push({ type: 'processing', content: 'Available Slot' });
      }
    });
    return listData;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0 }}>
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} style={{ fontSize: '10px' }} />
          </li>
        ))}
      </ul>
    );
  };

  const onSelect = (value) => {
    setSelectedDate(value);
  };

  const handleAddBooking = async (values) => {
    try {
      const payload = {
        title: values.title,
        startTime: values.time[0].toISOString(),
        endTime: values.time[1].toISOString(),
        date: selectedDate.format('YYYY-MM-DD')
      };
      
      const res = await api.post('/api/calendar/bookings', payload);
      message.success('Booking added successfully!');
      setIsModalVisible(false);
      form.resetFields();
      fetchCalendarData();
    } catch (error) {
      message.error('Failed to add booking');
    }
  };

  const cancelBooking = async (id) => {
    try {
      await api.patch(`/api/calendar/bookings/${id}/cancel`);
      message.success('Booking cancelled');
      fetchCalendarData();
    } catch (error) {
      message.error('Failed to cancel booking');
    }
  };

  const selectedDayBookings = bookings.filter(b => moment(b.start).isSame(selectedDate, 'day'));

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>My Calendar</Title>
        <Button type="primary" icon={<CalendarOutlined />} onClick={() => setIsModalVisible(true)}>
          New Meeting
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '2 1 600px' }}>
          <Card bordered={false}>
            <Calendar 
              value={selectedDate} 
              onSelect={onSelect} 
              dateCellRender={dateCellRender} 
            />
          </Card>
        </div>

        <div style={{ flex: '1 1 300px' }}>
          <Card title={`Schedule for ${selectedDate.format('MMMM Do, YYYY')}`} bordered={false}>
            {selectedDayBookings.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={selectedDayBookings}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Popconfirm title="Cancel meeting?" onConfirm={() => cancelBooking(item.id)}>
                        <Button type="text" danger icon={<DeleteOutlined />} size="small" />
                      </Popconfirm>
                    ]}
                  >
                    <List.Item.Meta
                      title={item.title}
                      description={
                        <Space>
                          <ClockCircleOutlined />
                          {moment(item.start).format('HH:mm')} - {moment(item.end).format('HH:mm')}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">No meetings scheduled for this day.</Text>
            )}
          </Card>
        </div>
      </div>

      <Modal
        title="Schedule a Meeting"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddBooking}>
          <Form.Item name="title" label="Meeting Title" rules={[{ required: true }]}>
            <Input placeholder="E.g., Project Sync" />
          </Form.Item>
          <Form.Item name="time" label="Time Range" rules={[{ required: true }]}>
            <TimePicker.RangePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Schedule
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClientCalendarPage;
