import {useState, useCallback} from 'react';
import {fetchInvoiceDetails} from '../api/invoiceService';
import {handleUnauthorizedAccess} from '../utils/unauthorizedHandler';

export const useInvoiceDetails = (ticketId, navigation = null) => {
  const [tickets, setTickets] = useState([]);
  const [products, setProducts] = useState([]);
  const [serviceAgreements, setServiceAgreements] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [customProducts, setCustomProducts] = useState([]);
  const [timeSheet, setTimeSheet] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const loadInvoiceData = useCallback(async () => {
    try {
      const response = await fetchInvoiceDetails(ticketId);
      if (response.status_code === 401) {
        if (navigation) {
          handleUnauthorizedAccess(navigation); // Only call if navigation is available
        }
        return;
      }
      if (response.success) {
        setTimeSheet(response.timesheets);
        setTickets(response.tickets);
        setCustomProducts(response.custom_products);
        setProducts(response.products);
        setServiceAgreements(response.service_agreements);
        setInventory(response.inventory);
        setInvoices(response.invoices);
      }
    } catch (error) {
      console.warn(error);
    }
  }, [ticketId, navigation]);

  return {
    tickets,
    products,
    serviceAgreements,
    inventory,
    customProducts,
    timeSheet,
    invoices,
    loadInvoiceData,
  };
};
