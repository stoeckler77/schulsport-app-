// Store the token in localStorage
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Get the token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove the token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Check if the user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};
