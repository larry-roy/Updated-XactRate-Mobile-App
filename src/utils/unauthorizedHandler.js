import {Platform} from 'react-native';
import NAVIGATION_STRING_CONSTANTS from '../navigation/NavigarionStringConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import showAlert from '../api/showAlert';
import {isAlertVisible, setAlertVisibility} from './alertVisibility';

export const handleUnauthorizedAccess = async navigation => {
  try {
    // Get all keys from AsyncStorage
    const asyncStorageKeys = await AsyncStorage.getAllKeys();

    // Clear or remove all items based on the platform
    if (asyncStorageKeys.length > 0) {
      if (Platform.OS === 'android') {
        await AsyncStorage.clear();
      }
      if (Platform.OS === 'ios') {
        await AsyncStorage.multiRemove(asyncStorageKeys);
      }
    }

    // Navigate to the login screen
    navigation.navigate(NAVIGATION_STRING_CONSTANTS.login_screen);
    if (!isAlertVisible()) {
      // Agar alert already show nahi ho raha
      setAlertVisibility(true);
      showAlert('Session expired.', 'Try logging in again', () =>
        setAlertVisibility(false),
      );
    }
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};
