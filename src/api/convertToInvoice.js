import AsyncStorage from '@react-native-async-storage/async-storage';
import URLs from './urls';

// Global POST function using fetch
export const convertToInvoiceApi = async (endpoint, data) => {
  try {
    var userToken = await AsyncStorage.getItem('userToken');
    const response = await fetch(`${URLs.INVOICE}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify(data),
    });

    // Response ko check karein
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
