export function getSocketUrl() {
  if (process.env.REACT_APP_SOCKET_URL) {
    return process.env.REACT_APP_SOCKET_URL;
  }
  const api = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  try {
    const url = new URL(api);
    return `${url.protocol}//${url.host}`;
  } catch {
    return 'http://localhost:5000';
  }
}
