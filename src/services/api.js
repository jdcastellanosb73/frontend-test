export const API_BASE_URL = 'https://backend-test-qawh.onrender.com';

export const getAuthToken = () => {
  return localStorage.getItem('access_token');
};

export const authFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  return fetch(`${API_BASE_URL}${url}`, config);
};