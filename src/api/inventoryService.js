import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_CONFIG from '../Components/global-config';

export const fetchInventory = async (pageNum) => {
  const userToken = await AsyncStorage.getItem('userToken');
  const options = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
  };

  const response = await fetch(
    `${URL_CONFIG.Url}api/inventory?page=${pageNum}`,
    options
  );
  return response.json();
};