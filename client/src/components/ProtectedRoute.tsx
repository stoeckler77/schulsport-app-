import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { getToken } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const verifyUser = async () => {
      const token = getToken();
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setUserRole(response.data.role);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    
    verifyUser();
  }, []);

  if (isAuthenticated === null) {
    // Still loading
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" />;
  }
  
  if (role && userRole !== role && userRole !== 'admin') {
    // Not authorized for this role
    return <Navigate to="/" />;
  }
  
  // Authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute; 