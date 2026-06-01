import apiClient, { unwrapAdminResponse } from './apiClient.js';

export async function getCompanySettings() {
  const response = await apiClient.get('/settings/company');
  return unwrapAdminResponse(response).data;
}

export async function updateCompanySettings(data) {
  const response = await apiClient.put('/settings/company', data);
  return unwrapAdminResponse(response).data;
}

export async function getSecuritySettings() {
  const response = await apiClient.get('/settings/security');
  return unwrapAdminResponse(response).data;
}

export async function updateSecuritySettings(data) {
  const response = await apiClient.put('/settings/security', data);
  return unwrapAdminResponse(response).data;
}

export async function getPaymentGatewayConfig() {
  const response = await apiClient.get('/settings/payment-gateway');
  return unwrapAdminResponse(response).data;
}

export async function updatePaymentGatewayConfig(data) {
  const response = await apiClient.put('/settings/payment-gateway', data);
  return unwrapAdminResponse(response).data;
}

export async function testMpesaStk(data) {
  const response = await apiClient.post('/financial/test-mpesa-stk', data);
  return unwrapAdminResponse(response).data;
}

export async function testMpesaB2c(data) {
  const response = await apiClient.post('/financial/test-mpesa-b2c', data);
  return unwrapAdminResponse(response).data;
}

export async function getTrustedCompanies() {
  const response = await apiClient.get('/settings/trusted-companies');
  return unwrapAdminResponse(response).data;
}

export async function updateTrustedCompanies(companies) {
  const response = await apiClient.put('/settings/trusted-companies', { companies });
  return unwrapAdminResponse(response).data;
}