// hooks/useSchedules.js
import { useState, useCallback } from 'react';
import { fetchSchedules } from '../api/scheduleService';
import { handleUnauthorizedAccess } from '../utils/unauthorizedHandler';

export const useSchedules = (navigation = null) => { // Default navigation to null
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const loadInitialData = useCallback(async () => {
    try {
      setDataSource([]);
      setRefresh(true);
      setIsListEnd(false);
      setOffset(1);
      setLoading(true);

      const response = await fetchSchedules(1);
      if (response.status_code === 401) {
        if (navigation) {
          handleUnauthorizedAccess(navigation);  // Only call if navigation is available
        }
        return;
      }
      if (response.schedule.data.length > 0) {
        setOffset(2);
        setDataSource(response.schedule.data);
      } else {
        setIsListEnd(true);
      }
      setRefresh(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [navigation]); // Add navigation to the dependencies

  const loadMoreData = useCallback(async () => {
    if (loading || isListEnd) return;

    try {
      setLoading(true);
      const response = await fetchSchedules(offset);
      if (response.status_code === 401) {
        if (navigation) {
          handleUnauthorizedAccess(navigation);
        }
        return;
      }
      if (response.schedule.data.length > 0) {
        setOffset(prev => prev + 1);
        setDataSource(prev => [...prev, ...response.schedule.data]);
      } else {
        setIsListEnd(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [loading, isListEnd, offset, navigation]);

  const refreshData = useCallback(async () => {
    try {
      setDataSource([]);
      setRefreshing(true);
      setRefresh(true);
      setIsListEnd(false);
      setOffset(1);

      const response = await fetchSchedules(1);
      if (response.status_code === 401) {
        if (navigation) {
          handleUnauthorizedAccess(navigation);
        }
        return;
      }
      if (response.schedule.data.length > 0) {
        setOffset(2);
        setDataSource(response.schedule.data);
      } else {
        setIsListEnd(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
      setRefresh(false);
    }
  }, [navigation]);

  return {
    dataSource,
    loading,
    refreshing,
    refresh,
    loadInitialData,
    loadMoreData,
    refreshData,
  };
};
