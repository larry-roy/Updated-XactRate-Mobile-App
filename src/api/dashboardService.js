// api/dashboardService.js
import URL_CONFIG from '../Components/global-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchDashboardData = async () => {
  const userToken = await AsyncStorage.getItem('userToken');
  const options = {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
  };
  
  const response = await fetch(`${URL_CONFIG.Url}api/dashboard`, options);
  return response.json();
};

export const getUserData = async () => {
  const userData = await AsyncStorage.getItem('userData');
  return JSON.parse(userData)?.user;
};