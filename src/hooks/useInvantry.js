import {useState, useCallback} from 'react';
import {fetchInventory} from '../api/inventoryService';
import {handleUnauthorizedAccess} from '../utils/unauthorizedHandler';

export const useInventory = (navigation = null) => {
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  const loadInitialData = useCallback(async () => {
    try {
      setIsListEnd(false);
      setDataSource([]);
      setOffset(1);
      setLoading(true);

      const response = await fetchInventory(1);
      if (response.status_code === 401) {
        if (navigation) {
          handleUnauthorizedAccess(navigation);
        }
        return;
      }
      if (response.success) {
        if (response.inventory.data.length > 0) {
          setOffset(2);
          setDataSource(response.inventory.data);
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
    if (loading || isListEnd) return;

    try {
      setLoading(true);
      const response = await fetchInventory(offset);
      if (response.status_code === 401) {
        if (navigation) {
          handleUnauthorizedAccess(navigation);
        }
        return;
      }
      if (response.success) {
        if (response.inventory.data.length > 0) {
          setOffset(prev => prev + 1);
          setDataSource(prev => [...prev, ...response.inventory.data]);
        } else {
          setIsListEnd(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [loading, isListEnd, offset, navigation]);

  return {
    dataSource,
    loading,
    refreshing,
    loadInitialData,
    loadMoreData,
  };
};
