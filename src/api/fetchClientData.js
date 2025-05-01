import {Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_CONFIG from '../Components/global-config';
import NAVIGATION_STRING_CONSTANTS from '../navigation/NavigarionStringConstants';

export const fetchClientData = async (
  pagination_page,
  setClientListData,
  setMoreDataLoading,
  setLoadData,
  navigation,
  searchQuery,
) => {
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

    if (!searchQuery) {
      setMoreDataLoading(true);
      const response = await fetch(
        URL_CONFIG.Url + `api/clients?page=${pagination_page}`,
        options,
      );
      const responseJson = await response.json();

      const newData = responseJson;

      if (newData.success === true) {
        if (newData.clients.data.length <= 0) {
          setMoreDataLoading(false);
          setLoadData(true);
        } else {
          setClientListData(prevData => [...prevData, ...newData.clients.data]);
          setMoreDataLoading(false);
        }
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
          navigation.navigate(NAVIGATION_STRING_CONSTANTS.login_screen);
          Alert.alert(newData.message);
        }
      }
    }
  } catch (error) {
    console.warn(error);
  }
};
