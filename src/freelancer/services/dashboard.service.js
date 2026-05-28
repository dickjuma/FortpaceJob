import apiClient from '../../admin/api/apiClient';

// Mock data for development
const mockDashboardStats = {
  availableFunds: { value: 'KES 425,000', trend: 'up', trendValue: '12%' },
  activeOrders: { value: '3' },
  responseRate: { value: '100%' },
  positiveRating: { value: '99%' }
};

const mockRecentActivity = [
  { id: 1, type: 'message', description: 'Acme Corp sent a message regarding \'Enterprise React Frontend Migration\'', time: '2 hours ago', isUrgent: true },
  { id: 2, type: 'delivery', description: 'Deliver Milestone 2 for \'E-commerce UI Design\' by tomorrow 5:00 PM.', time: '5 hours ago', isUrgent: true },
  { id: 3, type: 'request', description: 'A client is looking for a Senior React Developer for a 3-month contract.', time: '1 day ago', isUrgent: false }
];

const mockActiveOrders = [
  { id: 1, buyer: 'Acme Corp', gig: 'I will build a React Web App', dueIn: '2d 14h', total: 'KES 120,000', status: 'In Progress' },
  { id: 2, buyer: 'John Doe', gig: 'I will fix CSS bugs in Tailwind', dueIn: '12h', total: 'KES 15,000', status: 'Needs Delivery' }
];

const mockEarningsData = {
  total: 'KES 850,000',
  monthly: 'KES 230,000',
  weekly: 'KES 57,500',
  daily: 'KES 8,200',
  chartData: [30000, 40000, 35000, 50000, 45000, 60000, 70000]
};

const mockPerformanceMetrics = {
  responseTime: '1 hour',
  completionRate: '95%',
  satisfaction: '4.9/5',
  repeatClients: '65%'
};

export const getDashboardStats = async () => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDashboardStats);
    }, 500);
  });
};

export const getRecentActivity = async () => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRecentActivity);
    }, 500);
  });
};

export const getActiveOrders = async () => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockActiveOrders);
    }, 500);
  });
};

export const getEarningsData = async () => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEarningsData);
    }, 500);
  });
};

export const getPerformanceMetrics = async () => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPerformanceMetrics);
    }, 500);
  });
};

// Update freelancer availability status
export const updateAvailabilityStatus = async (status) => {
  try {
    const response = await apiClient.put('/freelancer/dashboard/availability', { status });
    return response.data;
  } catch (error) {
    console.error('Error updating availability status:', error);
    throw error;
  }
};