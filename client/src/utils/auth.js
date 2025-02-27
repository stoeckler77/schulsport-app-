import Cookies from 'js-cookie';

// Create a utility function for storage
const storage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage is not available:', error);
      return null;
    }
  },
  
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage is not available:', error);
      return false;
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage is not available:', error);
      return false;
    }
  }
};

// In-memory storage fallback
const memoryStorage = new Map();

export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    return memoryStorage.get('token');
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    memoryStorage.set('token', token);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    memoryStorage.delete('token');
  }
};

export default storage; 