// api/clientService.js
import URL_CONFIG from '../Components/global-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchClients = async (page, search = '') => {
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
    `${URL_CONFIG.Url}api/clients?page=${page}&search=${search}`,
    options
  );
  return response.json();
};