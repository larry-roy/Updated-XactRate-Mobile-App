import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to clear AsyncStorage
export const clearAsyncStorage = async () => {
  try {
    const asyncStorageKeys = await AsyncStorage.getAllKeys();

    if (asyncStorageKeys.length > 0) {
      if (Platform.OS === 'android') {
        await AsyncStorage.clear();
      } else if (Platform.OS === 'ios') {
        await AsyncStorage.multiRemove(asyncStorageKeys);
      }
    }
  } catch (error) {
    console.warn('Error clearing AsyncStorage:', error.message);
  }
};
