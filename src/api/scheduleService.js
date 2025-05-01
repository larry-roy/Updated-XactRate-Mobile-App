// api/scheduleService.js
import URL_CONFIG from '../Components/global-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchSchedules = async (page) => {
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
    `${URL_CONFIG.Url}api/schedules?status=&page=${page}`,
    options
  );
  return response.json();
};