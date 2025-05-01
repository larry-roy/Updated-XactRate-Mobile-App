// hooks/useClients.js
import {useState, useCallback} from 'react';
import {fetchClients} from '../api/clientService';
import {handleUnauthorizedAccess} from '../utils/unauthorizedHandler';

export const useClients = (navigation = null) => {
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadInitialData = useCallback(async () => {
    try {
      setIsListEnd(false);
      setDataSource([]);
      setOffset(1);
      setLoading(true);

      const response = await fetchClients(1);
      if (response.status_code === 401) {
        if (navigation) {
          handleUnauthorizedAccess(navigation); // Only call if navigation is available
        }
        return;
      }
      if (response.success) {
        if (response.clients.data.length > 0) {
          setOffset(2);
          setDataSource(response.clients.data);
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
  }, [navigation]);

  const loadMoreData = useCallback(async () => {
    if (loading || isListEnd || searchQuery) return;

    try {
      setLoading(true);
      const response = await fetchClients(offset);
      if (response.status_code === 401) {
        if (navigation) {
          handleUnauthorizedAccess(navigation); // Only call if navigation is available
        }
        return;
      }
      if (response.success) {
        if (response.clients.data.length > 0) {
          setOffset(prev => prev + 1);
          setDataSource(prev => [...prev, ...response.clients.data]);
        } else {
          setIsListEnd(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [loading, isListEnd, offset, searchQuery, navigation]);

  const refreshData = useCallback(async () => {
    try {
      setOffset(1);
      setIsListEnd(false);
      setDataSource([]);
      setRefreshing(true);

      const response = await fetchClients(1);
      if (response.status_code === 401) {
        if (navigation) {
          handleUnauthorizedAccess(navigation); // Only call if navigation is available
        }
        return;
      }
      if (response.success) {
        if (response.clients.data.length > 0) {
          setOffset(2);
          setDataSource(response.clients.data);
        } else {
          setIsListEnd(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  }, [navigation]);

  const searchClients = useCallback(
    async text => {
      setSearchQuery(text);
      if (text.length <= 2) {
        if (text.length === 0) {
          loadInitialData();
        }
        return;
      }

      try {
        const response = await fetchClients(1, text);
        if (response.success) {
          setDataSource(response.clients.data);
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [loadInitialData],
  );

  return {
    dataSource,
    loading,
    refreshing,
    searchQuery,
    loadInitialData,
    loadMoreData,
    refreshData,
    searchClients,
    setSearchQuery,
  };
};
