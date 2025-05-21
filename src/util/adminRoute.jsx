import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from 'react-router-dom';
import Loading from '@/layout/loading';

const PrivateRoute = ({ isAdminRoute }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me/`, {
          headers: {
            Authorization: `token ${token}`,
          },
        });
        
        const userData = response.data;
        setIsAdmin(userData && userData.role === "admin");
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;