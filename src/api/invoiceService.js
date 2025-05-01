// api/invoiceService.js
import URL_CONFIG from '../Components/global-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchInvoiceDetails = async (ticketId) => {
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
    `${URL_CONFIG.Url}api/invoices?ticket_id=${ticketId}`,
    options
  );
  return response.json();
};

export const downloadInvoicePDF = async (ticketId) => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    url: `${URL_CONFIG.Url}api/tickets/print?id=${ticketId}`,
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      accept: 'application/json',
    },
  };
};