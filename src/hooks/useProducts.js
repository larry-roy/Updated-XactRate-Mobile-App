import {useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchProductsApi} from '../api/productsService';
import {handleUnauthorizedAccess} from '../utils/unauthorizedHandler';

const useProducts = (navigation = null) => {
  const [productData, setProductData] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [offsetProduct, setOffsetProduct] = useState(1); // Start from page 1
  const [isListEndProduct, setIsListEndProduct] = useState(false);

  const loadProducts = useCallback(
    async (catalogId, categoryId, reset = false) => {
      if (loadingProduct || (!reset && isListEndProduct)) return;

      try {
        setLoadingProduct(true);
        const userToken = await AsyncStorage.getItem('userToken');

        const response = await fetchProductsApi(
          catalogId,
          categoryId,
          offsetProduct, // Use current offset (starts at 1)
          userToken,
        );
        if (response.status_code === 401) {
          if (navigation) {
            handleUnauthorizedAccess(navigation); // Only call if navigation is available
          }
          return;
        }

        if (response.products?.length > 0) {
          if (reset) {
            // Replace data on reset (first load or refresh)
            setProductData(response.products);
          } else {
            // Append new data for subsequent pages, avoiding duplicates
            setProductData(prev => {
              const newData = response.products.filter(
                newItem => !prev.some(prevItem => prevItem.id === newItem.id),
              );
              return [...prev, ...newData];
            });
          }
          setOffsetProduct(prev => prev + 1); // Increment page for next request
        } else {
          setIsListEndProduct(true); // No more data to load
        }
      } catch (error) {
        console.error('Error in useProducts:', error);
      } finally {
        setLoadingProduct(false);
      }
    },
    [loadingProduct, isListEndProduct, offsetProduct, navigation],
  );

  // Reset function to restart from page 1
  const resetProducts = useCallback(() => {
    setProductData([]);
    setOffsetProduct(1); // Reset to page 1
    setIsListEndProduct(false);
  }, []);

  return {
    productData,
    loadingProduct,
    offsetProduct,
    isListEndProduct,
    loadProducts,
    resetProducts,
  };
};

export default useProducts;
