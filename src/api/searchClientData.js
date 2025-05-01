// searchUtils.js
import {Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URL_CONFIG from '../Components/global-config';
import NAVIGATION_STRING_CONSTANTS from '../navigation/NavigarionStringConstants';

export const searchClientData = async (
  text,
  setClientListData,
  setLoadData,
  setCurrentPage,
  navigation,
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

    if (text.length > 2) {
      setTimeout(() => {
        fetch(URL_CONFIG.Url + `api/clients?search=${text}`, options)
          .then(response => response.json())
          .then(responseJson => {
            const newData = responseJson;
            if (newData.success === true) {
              setClientListData(newData.clients.data);
            } else if (newData.success === false) {
              if (newData.status_code === 401) {
                AsyncStorage.clear();
                navigation.navigate(NAVIGATION_STRING_CONSTANTS.login_screen);
              }
            }
          })
          .catch(error => {
            console.warn(error);
          });
      }, 200);
    } else if (text.length < 1) {
      fetch(URL_CONFIG.Url + `api/clients?search=${text}`, options)
        .then(response => response.json())
        .then(responseJson => {
          const newData = responseJson;
          if (newData.success === true) {
            setClientListData(newData.clients.data);
          } else if (newData.success === false) {
            if (newData.status_code === 401) {
              const asyncStorageKeys = AsyncStorage.getAllKeys();
              if (asyncStorageKeys.length > 0) {
                if (Platform.OS === 'android') {
                  AsyncStorage.clear();
                } else if (Platform.OS === 'ios') {
                  AsyncStorage.multiRemove(asyncStorageKeys);
                }
              }
              // Optionally you can handle logout here, e.g., show alert or redirect
            }
          }
        })
        .catch(error => {
          console.warn(error);
        });
      setCurrentPage(1);
      setLoadData(false);
    }
  } catch (error) {
    console.warn(error);
  }
};
