// hooks/useTickets.js
import {useState, useCallback} from 'react';
import {fetchAllTickets} from '../api/allTicketService';
import {handleUnauthorizedAccess} from '../utils/unauthorizedHandler';

export const useAllTickets = (navigation = null) => {
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [status, setStatus] = useState('schedule');

  // Function to clear the data state
  const clearData = () => {
    setDataSource([]);
    setOffset(1);
    setIsListEnd(false);
  };

  const getInitialData = useCallback(
    async (newStatus = 'schedule') => {
      clearData(); // Clear data before fetching new data

      try {
        setStatus(newStatus);
        setLoading(true);

        const response = await fetchAllTickets(newStatus, 1);
        if (response.status_code === 401) {
          if (navigation) {
            handleUnauthorizedAccess(navigation); // Only call if navigation is available
          }
          return;
        }
        if (response.success) {
          if (response.tickets.data.length > 0) {
            setOffset(2);
            setDataSource(response.tickets.data);
          } else {
            setIsListEnd(true);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigation],
  );

  const loadMoreData = useCallback(async () => {
    if (loading || isListEnd) return;

    try {
      setLoading(true);
      const response = await fetchAllTickets(status, offset);
      if (response.status_code === 401) {
        if (navigation) {
          handleUnauthorizedAccess(navigation); // Only call if navigation is available
        }
        return;
      }
      if (response.tickets.data.length > 0) {
        setOffset(prev => prev + 1);
        setDataSource(prev => [...prev, ...response.tickets.data]);
      } else {
        setIsListEnd(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [loading, isListEnd, status, offset, navigation]);

  return {
    dataSource,
    loading,
    refreshing,
    status,
    getInitialData,
    loadMoreData,
    setRefreshing,
    setStatus,
  };
};
