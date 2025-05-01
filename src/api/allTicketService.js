// api/ticketService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_CONFIG from '../Components/global-config';

export const fetchAllTickets = async (status, page) => {
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
    `${URL_CONFIG.Url}api/tickets?status=${status}&page=${page}`,
    options
  );
  return response.json();
};