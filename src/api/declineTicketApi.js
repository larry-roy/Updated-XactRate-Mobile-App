// ticketUtils.js
import {Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_CONFIG from '../Components/global-config';
import NAVIGATION_STRING_CONSTANTS from '../navigation/NavigarionStringConstants';

export const declineTicketApi = async (
  TicketId,
  setLoading,
  toggleLoading,
  navigation,
) => {
  try {
    toggleLoading(); // Show loading indicator
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
      URL_CONFIG.Url + `api/ticket/decline?ticket_id=${TicketId}`,
      options,
    );
    const responseJson = await response.json();
    setLoading(false);

    const newData = responseJson;

    if (newData.success === true) {
      navigation.navigate('Root', {
        screen: NAVIGATION_STRING_CONSTANTS.details_screen,
      });
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
        // Optionally, you can show an alert or redirect to login screen here
        Alert.alert('Session expired. Please log in again.');
        navigation.navigate(NAVIGATION_STRING_CONSTANTS.login_screen);
      }
    }
  } catch (error) {
    setLoading(false);
    console.warn(error);
  }
};
