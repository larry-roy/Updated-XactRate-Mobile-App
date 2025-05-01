// hooks/useDashboard.js
import {useState, useCallback} from 'react';
import {fetchDashboardData, getUserData} from '../api/dashboardService';
import {handleUnauthorizedAccess} from '../utils/unauthorizedHandler';

export const useDashboard = (navigation = null) => {
  const [userData, setUserData] = useState(null);
  const [clients, setClients] = useState([]);
  const [tickets, setTickets] = useState([]);

  const loadDashboardData = useCallback(async () => {
    try {
      const [dashboardResponse, user] = await Promise.all([
        fetchDashboardData(),
        getUserData(),
      ]);
      if (dashboardResponse.status_code === 401) {
        if (navigation) {
          handleUnauthorizedAccess(navigation); // Only call if navigation is available
        }
        return;
      }
      if (dashboardResponse.success) {
        setClients(dashboardResponse.clients.data);
        setTickets(dashboardResponse.tickets.data);
      }
      setUserData(user);
    } catch (error) {
      console.warn(error);
    }
  }, []);

  return {
    userData,
    clients,
    tickets,
    loadDashboardData,
  };
};
