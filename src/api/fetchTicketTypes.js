import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_CONFIG from '../Components/global-config';
import NAVIGATION_STRING_CONSTANTS from '../navigation/NavigarionStringConstants';

export const fetchTicketTypes = async (setTicketTypeData, navigation) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    
    const options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    };

    const response = await fetch(URL_CONFIG.Url + `api/tickets/types`, options);
    const responseJson = await response.json();
    const newData = responseJson;

    if (newData.success === true) {
      setTicketTypeData(newData.ticket_types);
    } else if (newData.success === false) {
      if (newData.status_code === 401) {
        const asyncStorageKeys = await AsyncStorage.getAllKeys();
        if (asyncStorageKeys.length > 0) {
          if (Platform.OS === 'android') {
            AsyncStorage.clear();
          } else if (Platform.OS === 'ios') {
            AsyncStorage.multiRemove(asyncStorageKeys);
          }
        }
        // Optional: Handle any actions after clearing AsyncStorage, such as redirecting to login
        navigation.navigate(NAVIGATION_STRING_CONSTANTS.login_screen);
        Alert.alert("Session expired. Please log in again.");
      }
    }
  } catch (error) {
    console.warn(error);
  }
};
