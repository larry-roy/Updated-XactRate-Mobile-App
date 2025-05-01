import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  SafeAreaView,
  Alert,
  BackHandler,
  Platform,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState, createRef} from 'react';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import STRING_CONSTANTS from './strings/strings';
import URL_CONFIG from './Components/global-config';
import SignatureCapture from 'react-native-signature-capture';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import NAVIGATION_STRING_CONSTANTS from './navigation/NavigarionStringConstants';
import BottomTabBar from './Components/BottomTabBar';
import theme from './utils/theme';
import {fetchClientData} from './api/fetchClientData';
import {searchClientData} from './api/searchClientData';
import {fetchTicketTypes} from './api/fetchTicketTypes';
import {declineTicketApi} from './api/declineTicketApi';
import showAlert from './api/showAlert';
import FooterLoader from './Components/FooterLoader';
import useProducts from './hooks/useProducts';
import {useOrientation} from './utils/orientation';
import useBackHandler from './utils/navigationUtils';
import QuantityAdjusterModal from './Components/QuantityAdjusterModal';

const Ticket = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const orientation = useOrientation();
  const [activeTab, setActiveTab] = useState(3);
  const {
    productData,
    loadingProduct,
    isListEndProduct,
    loadProducts,
    resetProducts,
  } = useProducts(navigation);

  const [loading, setLoading] = useState(false);
  const toggleLoading = () => {
    setLoading(prev => !prev);
  };

  ////  API and validation variables ////

  const {
    ClientId,
    ClientFName,
    ClientLName,
    ClientEmail,
    ClientMobile,
    TicketId,
    TicketDescription,
    TicketTypeId,
    Status,
  } = route.params ?? {};
  // Date Var variable
  const [ticketId, setTicketId] = useState();
  const [ticketTypeId, setTicketTypeId] = useState();
  const [ticketStatus, setTicketStatus] = useState();
  const [isActiveView, setIsActiveView] = useState(false);
  const [date, setDate] = useState();
  // Invoice Data variable
  const [selectedTimer, setSelectedTimer] = useState('T&D Time');

  // td timer variable
  const [tdSeconds, setTdSeconds] = useState(0);
  const [tdMinutes, setTdMinutes] = useState(0);
  const [tdHours, setTdHours] = useState(0);
  const [isTdActive, setIsTdActive] = useState(false);
  const [tdTimer, setTdTimer] = useState();

  // Job timer variable
  const [jobSeconds, setJobSeconds] = useState(0);
  const [jobMinutes, setJobMinutes] = useState(0);
  const [jobHours, setJobHours] = useState(0);
  const [isJobActive, setIsJobActive] = useState(false);
  const [jobTimer, setJobTimer] = useState();

  // Break Time variable
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [breakMinutes, setBreakMinutes] = useState(0);
  const [breakHours, setBreakHours] = useState(0);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [breakTimer, setBreakTimer] = useState();

  // Passing parameters variable
  const [clientListData, setClientListData] = useState([]);
  const [ticketTypeData, setTicketTypeData] = useState();
  const [errorMessage, setErrorMessage] = useState(false);
  const [timeSheetView, setTimeSheetView] = useState(false);

  //searchQuery
  const [searchQuery, setSearchQuery] = useState('');
  const [loadData, setLoadData] = useState(false);
  const [moreDataLoading, setMoreDataLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  //conclusion variables
  const [timeSheet, setTimeSheet] = useState(null);
  const [productsTotal, setProductsTotal] = useState();
  const [totalPay, setTotalPay] = useState();
  const [balance, setBalance] = useState();
  const [paymentType, setPaymentType] = useState();
  const [checkNumber, setCheckNumber] = useState(null);
  const [note, setNote] = useState();
  const [signature, setSignature] = useState();
  const [clientId, setClientId] = useState();
  const [serviceAgreementTotal, setServiceAgreementTotal] = useState();
  const [invoiceData, setInvoiceData] = useState({
    client: {
      id: '',
      fn: '',
      ln: '',
      email: '',
      phone_no_1: '',
    },
    service_agreements: [],
    inventory: [],
    timeSheet: [{td_time: '', job_time: '', pause_time: '', total_amount: '0'}],
    products: [],
    ticket_id: TicketId,
    ticketDate: '',
    travel_Time: '',
    jobTime: '',
    total: '',
  });

  const [invoiceTotalAmount, setInvoiceTotalAmount] = useState(0);
  // Modals variables
  const [productsModal, setProductsModal] = useState(false);

  const [catalogId, setCatalogId] = useState();
  const [categoryId, setCategoryId] = useState();
  const [ManufacturerName, setManufacturerName] = useState();

  // custom products add variables
  const [customProductId, setCustomProductId] = useState(0);
  const [productId, setProductId] = useState();
  const [productName, setProductName] = useState();
  const [productStatus, setProductStatus] = useState();
  const [productCode, setProductCode] = useState();
  const [description, setDescription] = useState();
  const [qty, setQty] = useState();
  const [amount, setAmount] = useState();
  const [customProductErrorMessage, setCustomProductErrorMessage] =
    useState(false);
  const [editString, setEditString] = useState();
  const [addProductData, setAddProductData] = useState();
  const [warranty, setWarranty] = useState();
  const [contingencyProduct, setContingencyProduct] = useState();
  const [netLabourProfit, setNetLabourProfit] = useState();
  const [employeeData, setEmployeeData] = useState([]);
  const [selectEmployees, setSelectEmployees] = useState();
  const [employeeHours, setEmployeeHours] = useState();
  const [employeeCost, setEmployeeCost] = useState();

  //add product
  const toggleProductsModal = () => {
    setProductsModal(!productsModal);
  };

  // add product Employee //
  const toggleAddEmployeeModal = () => {
    setCustomProduct(false);
    setAddEmployee(true);
  };
  //// Variable initialization  ////
  const [CatalogData, setCatalogData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  // const [productData, setProductData] = useState([]);
  const [serviceAgreementData, setServiceAgreementData] = useState();
  const [inventoryData, setInventoryData] = useState();

  const onScreenLoad = () => {
    setInvoiceClient({
      id: ClientId,
      fname: ClientFName,
      lname: ClientLName,
      email: ClientEmail,
      phone_no_1: ClientMobile,
    });
    updateInvoice();
    if (TicketId) {
      setTicketId(TicketId);
    } else {
      setTicketId(null);
    }
    setTicketTypeId(TicketTypeId);
  };

  /**
   * Sets the client for the current invoice. Needs an object containing client info
   * @param {*} client
   */

  function setInvoiceClient(client) {
    setClientId(client.id);
    invoiceData.client.id = client.id;
    invoiceData.client.fn = client.fname;
    invoiceData.client.ln = client.lname;
    invoiceData.client.email = client.email;
    invoiceData.client.phone_no_1 = client.phone_no_1;
    saveInvoiceData();
    setErrorMessage('');
  }

  /**
   * Triggers on screen load
   */

  useEffect(() => {
    if (Status == 5 || Status == 6) {
      getSuspendApi();
    }
    clientNameFetchData();
    ticketType();
    updateDate(new Date());
    setClientListData([]);
    onScreenLoad();
    getInvoiceData();
    updateInvoice();

    if (Status == 5 || Status == 6) {
      return;
    } else {
      startTdTimePop();
    }
    warrantyPercentage();
    fetchServiceAgreementData();
    fetchInventory();
    FetchEmployeeData();
    FetchCatalogData();
    if (Platform.OS === 'ios') {
      showMode('date');
    }
    // When user Back Navigation

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  /**
   * Triggers when screen is focused
   */

  useFocusEffect(
    React.useCallback(() => {
      getInvoiceData();
      updateInvoice();
      clientNameFetchData();
      setClientListData([]);
      warrantyPercentage();
      fetchServiceAgreementData();
      fetchInventory();
      FetchEmployeeData();
      FetchCatalogData();
      // When user Back Navigation
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.goBack();
          return true;
        },
      );
      return () => backHandler.remove();
    }, []),
  );

  /**
   * if user start suspend ticket than call function first screen load and fill the invoice
   */

  async function getSuspendApi() {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        throw new Error('User token is missing');
      }

      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      };

      const response = await fetch(
        URL_CONFIG.Url + 'api/invoices/suspend?ticket_id=' + TicketId,
        options,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch suspend data');
      }

      const responseJson = await response.json();
      const suspendData = responseJson;

      if (suspendData.tickets) {
        const d_ = suspendData.tickets;
        const n_ = suspendData.tickets;

        const currentDate = new Date(d_.date + ' 10:00:00');
        setInvoiceDate(currentDate);
        setSelectedDate(currentDate);
        setNote(n_.notes);
      }

      if (suspendData.timesheets && suspendData.timesheets.length > 0) {
        const sheetTime = suspendData.timesheets[0].total;
        if (sheetTime > 0) {
          setTimeSheetView(true);
          invoiceData.timeSheet[0].total_amount = sheetTime;
        }

        const tdTime = suspendData.timesheets[0].travel_time;
        const jobTime_ = suspendData.timesheets[0].job_time;
        const pauseTime = suspendData.timesheets[0].pause_time;

        invoiceData.timeSheet[0].td_time = tdTime;
        invoiceData.timeSheet[0].job_time = jobTime_;
        invoiceData.timeSheet[0].pause_time = pauseTime;

        const [td_hours, td_minutes, td_seconds] = tdTime
          .split(':')
          .map(value => parseInt(value, 10));
        const [job_hours, job_minutes, job_seconds] = jobTime_
          .split(':')
          .map(value => parseInt(value, 10));
        const [pause_hours, pause_minutes, pause_seconds] = pauseTime
          .split(':')
          .map(value => parseInt(value, 10));

        setTdHours(td_hours);
        setTdMinutes(td_minutes);
        setTdSeconds(td_seconds);
        setJobHours(job_hours);
        setJobMinutes(job_minutes);
        setJobSeconds(job_seconds);
        setBreakHours(pause_hours);
        setBreakMinutes(pause_minutes);
        setBreakSeconds(pause_seconds);
      }

      invoiceData.products = suspendData.products;
      invoiceData.service_agreements = suspendData.service_agreements;
      invoiceData.inventory = suspendData.inventory;

      // Call the function to handle invoice data
      await getInvoiceData();

      // Show the view
      setIsActiveView(true);
    } catch (error) {
      console.warn('Error in fetching suspend data:', error);
    }
  }

  /**
   * get show pop when user on invoice screen
   */

  function startTdTimePop() {
    if (invoiceData.client.id) {
      if (tdTimer) {
      } else {
        Alert.alert(
          STRING_CONSTANTS.default_alert_box_tittle,
          STRING_CONSTANTS.auto_start_timer_alert_box,
          [
            {
              text: 'No',
              onPress: () => setIsActiveView(true),
              style: 'no',
            },
            {text: 'Yes', onPress: () => startTdTime() + setIsActiveView(true)},
          ],
        );
      }
    }
  }

  /**
   * ticket status change function
   */

  function ticketStatusChangeAlertBox(status) {
    if (status == 'lock') {
      showAlert(
        STRING_CONSTANTS.default_alert_box_tittle,
        'Do you want to lock the ticket?',
        () => convertToInvoice({locked: 'locked'}),
      );
    } else if (status == 'suspend') {
      showAlert(
        STRING_CONSTANTS.default_alert_box_tittle,
        'Do you want to suspend ticket ?',
        () => ticketSuspendApi(),
      );
    } else if (status == 'decline') {
      showAlert(
        STRING_CONSTANTS.default_alert_box_tittle,
        'Do you want to decline ticket ?',
        () => ticketDecline(),
      );
    }
  }

  /**
   * Stores invoice data to Async storage
   */

  async function saveInvoiceData() {
    try {
      AsyncStorage.setItem('invoice', JSON.stringify(invoiceData));
    } catch (error) {
      console.log(error);
    }
    updateInvoice();
  }

  /**
   * Retrieves invoice data from Async storage and sets invoiceData to retrieved value
   */

  const getInvoiceData = async () => {
    const invoice = invoiceData;

    // Helper function to safely calculate totals
    const calculateTotal = (items, key) => {
      return items.reduce((acc, item) => acc + parseFloat(item[key] || 0), 0);
    };

    const productsTotal = calculateTotal(invoice.products, 'total');
    const serviceAgreementTotal = calculateTotal(
      invoice.service_agreements,
      'serviceAmount',
    );
    const inventoryTotal = calculateTotal(invoice.inventory, 'inventoryAmount');
    const timerTotalAmount = calculateTotal(invoice.timeSheet, 'total_amount');

    const totalAmount =
      productsTotal + serviceAgreementTotal + inventoryTotal + timerTotalAmount;

    // Format totals to 2 decimal places
    const formattedTotal = totalAmount.toFixed(2);
    const formattedServiceAgreement = serviceAgreementTotal.toFixed(2);

    // Set state
    setBalance(formattedTotal);
    setProductsTotal(formattedTotal);
    setServiceAgreementTotal(formattedServiceAgreement);
  };

  /**
   * Updates invoice that is displayed after retrieving from Async Storage then invoiceData object
   */

  async function updateInvoice() {
    getInvoiceData();
  }

  /**
   * Fetch Client List Data form api when user select invoice client
   */

  const clientNameFetchData = async pagination_page => {
    await fetchClientData(
      pagination_page,
      setClientListData,
      setMoreDataLoading,
      setLoadData,
      navigation,
      searchQuery,
    );
  };

  /**
   * Fetch Client List Search bar Data form api when user select invoice client
   */

  const SearchFetch = text => {
    // setSearchText(text);
    searchClientData(
      text,
      setClientListData,
      setLoadData,
      setCurrentPage,
      navigation,
    );
  };

  /**
   * Fetch Tickets Type Data form api when user select invoice client
   */

  const ticketType = async () => {
    fetchTicketTypes(setTicketTypeData, navigation);
  };

  /**
   * Get ticket suspend when user on press suspend button
   */

  const ticketSuspend = async () => {
    toggleLoading();
    var userToken = await AsyncStorage.getItem('userToken');
    var options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    };
    fetch(URL_CONFIG.Url + `api/ticket/suspend?ticket_id=` + TicketId, options)
      .then(response => response.json())
      .then(responseJson => {
        setLoading(false);
        const newData = responseJson;
        if (newData.success == true) {
          navigation.navigate('Root', {
            screen: NAVIGATION_STRING_CONSTANTS.details_screen,
          });
        } else if (newData.success == false) {
          if (newData.status_code == 401) {
            const asyncStorageKeys = AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
              if (Platform.OS === 'android') {
                AsyncStorage.clear();
              }
              if (Platform.OS === 'ios') {
                AsyncStorage.multiRemove(asyncStorageKeys);
              }
            }
          }
        }
      })
      .catch(error => {
        console.warn(error);
      });
  };

  /**
   * Get ticket open when user start td timer
   */

  const ticketDecline = ticketId => {
    declineTicketApi(ticketId, setLoading, toggleLoading, navigation);
  };

  /**
   * Create Ticket when Select client and than next process
   */

  const selectTicket = async item => {
    setErrorMessage('');
    setTicketTypeId(item.id);
    setTicketStatus('create_ticket');
    startTdTimePop();
  };

  /**
   * Date Picker Invoice
   */
  const updateDate = date => {
    setInvoiceDate(date);
    var separator = '-';
    var _d =
      date.getFullYear() +
      separator +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      separator +
      date.getDate().toString().padStart(2, '0');
    setDate(_d);
  };

  const [invoiceDate, setInvoiceDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const invoiceDateOnChange = (event, selectedDate) => {
    const currentDate = selectedDate || invoiceDate;
    setShow(Platform.OS === 'ios');
    setInvoiceDate(currentDate);
    updateDate(new Date(currentDate));
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  //// React native Ios Date Picker Functions ////

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePickerIos = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = date => {
    var separator = '-';
    var _d =
      date.getFullYear() +
      separator +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      separator +
      date.getDate().toString().padStart(2, '0');
    setInvoiceDate(_d);
    setSelectedDate(date);
    hideDatePicker();
  };

  /**
   * Timer Set to variable
   */

  function setTimeValues() {
    // Format a time from hours, minutes, seconds
    const formatTime = (hours, minutes, seconds) =>
      hours.toString().padStart(2, '0') +
      ':' +
      minutes.toString().padStart(2, '0') +
      ':' +
      seconds.toString().padStart(2, '0');

    // TD Time
    const td_time = formatTime(tdHours, tdMinutes, tdSeconds);
    invoiceData.timeSheet[0].td_time = td_time;
    setTdTimer(td_time);

    // Check if any td time value is greater than 0
    if (tdHours > 0 || tdMinutes > 0 || tdSeconds > 0) {
      invoiceData.timeSheet[0].total_amount = '83.52';
    }

    // Job Time
    const job_time = formatTime(jobHours, jobMinutes, jobSeconds);
    invoiceData.timeSheet[0].job_time = job_time;
    setJobTimer(job_time);

    // Break Time
    const pause_time = formatTime(breakHours, breakMinutes, breakSeconds);
    invoiceData.timeSheet[0].pause_time = pause_time;
    setBreakTimer(pause_time);

    // Update invoice
    updateInvoice();
  }

  /**
   * job and T&D Time Function
   */

  useEffect(() => {
    let interval = null;
    if (isTdActive) {
      interval = setInterval(() => {
        setTdSeconds(tdSeconds => tdSeconds + 1);
      }, 1000);
    } else if (!isTdActive && tdSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTdActive, tdSeconds]);

  const startTdTime = () => {
    setIsTdActive(!isTdActive);
    setIsJobActive(false);
    setIsBreakActive(false);
    setTimeValues();
    if (isTdActive == true || isBreakActive == true || isJobActive == true) {
      if (isTdActive == true) {
        setTimeSheetView(true);
        setTimeSheet('83.52');
        if (timeSheetView == true) {
        } else {
          var timeAmount = parseInt(productsTotal) + 83.52;
          var totalAmount = timeAmount.toFixed(2);
          setProductsTotal(totalAmount);
          setBalance(totalAmount);
        }
      }
    }
  };

  useEffect(() => {
    if (tdSeconds === 60) {
      setTdSeconds(0);
      setTdMinutes(tdMinutes => tdMinutes + 1);
    }
    if (tdMinutes === 60) {
      setTdMinutes(0);
      setTdHours(TdHours => TdHours + 1);
    }
  }, [tdSeconds, tdMinutes]);

  //**** End ****//

  /**
   * Job Timer Function
   */

  useEffect(() => {
    let interval = null;
    if (isJobActive) {
      interval = setInterval(() => {
        setJobSeconds(jobSeconds => jobSeconds + 1);
      }, 1000);
    } else if (!isJobActive && jobSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isJobActive, jobSeconds]);

  const startJobTime = () => {
    setIsJobActive(!isJobActive);
    setTimeValues();
    setIsBreakActive(false);
    setIsTdActive(false);
    if (isTdActive == true || isBreakActive == true) {
      if (isTdActive == true) {
        setTimeSheetView(true);
        setTimeSheet('83.52');
        if (timeSheetView == true) {
        } else {
          var timeAmount = parseInt(productsTotal) + 83.52;
          var totalAmount = timeAmount.toFixed(2);
          setProductsTotal(totalAmount);
          setBalance(totalAmount);
        }
      }
    }
  };

  useEffect(() => {
    if (jobSeconds === 60) {
      setJobSeconds(0);
      setJobMinutes(jobMinutes => jobMinutes + 1);
    }
    if (jobMinutes === 60) {
      setJobMinutes(0);
      setJobHours(jobHours => jobHours + 1);
    }
  }, [jobSeconds, jobMinutes]);

  //**** End ****//

  /**
   *  Break Time Function
   */

  useEffect(() => {
    let interval = null;
    if (isBreakActive) {
      interval = setInterval(() => {
        setBreakSeconds(pauseSeconds => pauseSeconds + 1);
      }, 1000);
    } else if (!isBreakActive && breakSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isBreakActive, breakSeconds]);

  const startPauseTime = () => {
    setIsBreakActive(!isBreakActive);
    setTimeValues();
    setIsTdActive(false);
    setIsJobActive(false);
    if (isTdActive == true || isJobActive == true) {
      if (isTdActive == true) {
        setTimeSheetView(true);
        setTimeSheet('83.52');
        if (timeSheetView == true) {
        } else {
          var timeAmount = parseInt(productsTotal) + 83.52;
          var totalAmount = timeAmount.toFixed(2);
          setProductsTotal(totalAmount);
          setBalance(totalAmount);
        }
        setTdTimer(
          tdHours.toString().padStart(2, '0') +
            ':' +
            tdMinutes.toString().padStart(2, '0') +
            ':' +
            tdSeconds.toString().padStart(2, '0'),
        );
      }
    }
  };

  useEffect(() => {
    if (breakSeconds === 60) {
      setBreakSeconds(0);
      setBreakMinutes(pauseMinutes => pauseMinutes + 1);
    }
    if (breakMinutes === 60) {
      setBreakMinutes(0);
      setBreakHours(pauseHours => pauseHours + 1);
    }
  }, [breakSeconds, breakMinutes]);

  //**** End ****//

  /**
   * Removes a product from the invoiceData using index and updates Async storage object
   * @param {*} index
   */

  const removeProduct = index => {
    invoiceData.products.splice(index, 1);
    getInvoiceData();
  };
  const removeServiceAgreement = index => {
    invoiceData.service_agreements.splice(index, 1);
    saveInvoiceData();
  };

  const removeInventory = index => {
    invoiceData.inventory.splice(index, 1);
    saveInvoiceData();
  };

  const calculateTotalPay = text => {
    var subtractTotalAmount = parseFloat(productsTotal) - parseFloat(text);
    var dueAmount = subtractTotalAmount.toFixed(2);
    if (dueAmount == 'NaN') {
      setBalance(0);
    } else {
      setBalance(dueAmount);
    }
  };

  function editProductFunction(product_values) {
    setProductId(product_values.id);
    setProductCode(product_values.code);
    setProductName(product_values.name);
    if (product_values.product_type == 'product') {
      if (product_values.name) {
        setDescription(product_values.name);
      } else {
        setDescription(product_values.description);
      }
    } else {
      setDescription(product_values.description);
    }
    setQty(`${product_values.quantity}`);
    setEmployeeHours(product_values.labour_hours);
    setAmount(product_values.actual_amount);
    setSelectEmployees(product_values.employees);
    var response = product_values.employees;
    var employee_cost = 0;
    if (response.length > 0) {
      for (var i = 0; i < response.length; i++) {
        employee_cost +=
          product_values.employees[i].hours * product_values.employees[i].cost;
        setEmployeeCost(employee_cost);
      }
    }
    setProductStatus(product_values.product_type);
    if (product_values.labour_hours == 0) {
      setEmployeeCost(0);
    }
    setCustomProductErrorMessage('');
    setEditString('edit_product');
    setDefaultForm(false);
    setCategory(false);
    setProduct(false);
    setEmployee(false);
    setAddEmployee(false);
    setServicesAgreement(false);
    setCustomProduct(true);
    setProductsModal(true);
  }

  // update product

  const productUpdateState = () => {
    // Parse warranty, contingency, and labor profit percentages
    const warrantyValue = parseFloat(warranty) / 100;
    const contingencyProductPercentage = parseFloat(contingencyProduct) / 100;
    const netLabourProfitPercentage = parseFloat(netLabourProfit) / 100;

    // Calculate amount value (considering quantity and warranty value)
    const amountValue =
      parseInt(amount) * parseInt(qty) +
      parseInt(amount) * parseInt(qty) * warrantyValue;

    // Calculate contingency and net labor profit, only multiplying employee cost in the respective calculations
    const contingencyProductValue =
      parseFloat(employeeCost) * contingencyProductPercentage;
    const netLabourProfitValue =
      parseFloat(employeeCost) * netLabourProfitPercentage;

    // Add employee cost only once to both contingency and net labor profit
    const totalContingencyAndLabourProfit =
      parseFloat(employeeCost) + contingencyProductValue + netLabourProfitValue;

    // Total amount including contingency, net labor profit, and amount
    const totalAmount = amountValue + totalContingencyAndLabourProfit;
    const productTotal = totalAmount.toFixed(2); // Ensure it's a string with two decimal places

    // Update the invoice total
    const updatedInvoiceTotal =
      parseFloat(invoiceTotalAmount) + parseFloat(productTotal);
    setInvoiceTotalAmount(updatedInvoiceTotal.toFixed(2)); // Ensure the total is correctly formatted to two decimal places

    // Prepare the updated product data
    const updatedProduct = {
      id: productId,
      code: productCode,
      product_type: productStatus,
      name: productName,
      description: description,
      quantity: parseInt(qty), // Ensure quantity is an integer
      labour_hours: parseFloat(employeeHours), // Ensure hours are a float
      employees: selectEmployees,
      actual_amount: parseFloat(amount), // Ensure amount is a float
      total: productTotal,
    };

    // Find and update the product in the invoice data
    const productIndex = invoiceData.products.findIndex(
      prod => prod.id === productId,
    );
    if (productIndex !== -1) {
      invoiceData.products[productIndex] = updatedProduct;
    }

    // Toggle the product modal and refresh the invoice data
    toggleProductsModal();
    getInvoiceData();

    // Reset product name after updating
    setProductName('');
  };

  /**
   * Signature Screen Functions
   */

  const sign = createRef();

  const saveSign = () => {
    sign.current.saveImage();
  };

  const resetSign = () => {
    sign.current.resetImage();
  };

  const _onSaveEvent = result => {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    setSignature(result.encoded);
    setSignaturePad(false);
    Alert.alert(
      STRING_CONSTANTS.default_alert_box_tittle,
      STRING_CONSTANTS.captured_signature_alert_box,
      [{text: 'OK', onPress: () => ''}],
    );
  };

  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    // console.log('dragged');
  };

  /**
   * ActivityIndicator refresh on when user pull to bottom
   */

  const renderFooter = () => {
    return (
      <View style={{paddingVertical: 20}}>
        <ActivityIndicator
          animating
          size="large"
          color={theme.colors.primary}
        />
      </View>
    );
  };

  /**
   * handel load more data from fetch api
   */

  const handleLoadMore = () => {
    var pagination_page = currentPage; // initialize the variable with 0
    if (loadData == false) {
      if (moreDataLoading == false) {
        pagination_page += 1; // add 1 to the variable using the increment operator
        setCurrentPage(pagination_page);
        clientNameFetchData(pagination_page);
      }
    }
  };

  /**
   * Fetch Catalog From Api Data when user select
   */

  const FetchCatalogData = async () => {
    setCatalogData();
    setManufacturerName();
    var userToken = await AsyncStorage.getItem('userToken');
    var options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    };
    await fetch(URL_CONFIG.Url + 'api/catalogs', options)
      .then(response => response.json())
      .then(responseJson => {
        const newData = responseJson;
        if (newData.success == true) {
          //console.log(data);
          setCatalogData(newData.catalogs.data);
        } else if (newData.success == false) {
          if (newData.status_code == 401) {
            const asyncStorageKeys = AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
              if (Platform.OS === 'android') {
                AsyncStorage.clear();
              }
              if (Platform.OS === 'ios') {
                AsyncStorage.multiRemove(asyncStorageKeys);
              }
            }
          }
        }
      })
      .catch(error => {
        console.warn(error);
      });
  };

  /**
   * Fetch Category  From Api Data  when user select
   */
  const FetchCategoryData = async item => {
    setCategoryData();
    setCatalogId(item.id);
    setManufacturerName({
      catalog_manufacturer_name: item.manufacturer_name,
      category_manufacturer_name: '',
    });
    setCatalog(false);
    setCategory(true);
    var itemId = item.id;
    var userToken = await AsyncStorage.getItem('userToken');
    var options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    };
    await fetch(URL_CONFIG.Url + 'api/catalog/categories?id=' + itemId, options)
      .then(response => response.json())
      .then(responseJson => {
        const newData = responseJson;
        if (newData.success == true) {
          setCategoryData(newData.categories.data);
          // console.log(newData.categories.data);
        } else if (newData.success == false) {
          if (newData.status_code == 401) {
            const asyncStorageKeys = AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
              if (Platform.OS === 'android') {
                AsyncStorage.clear();
              }
              if (Platform.OS === 'ios') {
                AsyncStorage.multiRemove(asyncStorageKeys);
              }
            }
          }
        }
      })
      .catch(error => {
        console.warn(error);
      });
  };

  /**
   * Fetch products data Api when user select
   */

  const fetchProductsData = async item => {
    // Reset the products state
    resetProducts();

    // Set the manufacturer name to the state
    setManufacturerName({
      catalog_manufacturer_name: ManufacturerName.catalog_manufacturer_name,
      category_manufacturer_name: item.des,
    });

    // Update states for category and product visibility
    setCategory(false);
    setProduct(true);

    // Set category id to the state
    setCategoryId(item.id);
    var reset = true;
    // Load products for the new category
    loadProducts(catalogId, item.id, reset); // Load page 1 for the new category
  };

  /**
   * Handle Load more products data
   */

  const handleLoadMoreProduct = () => {
    if (!loadingProduct && !isListEndProduct) {
      loadProducts(catalogId, categoryId); // Load next page
    }
  };

  /**
   * Fetch WarrantyPercentage From Api when user select
   */

  const warrantyPercentage = async () => {
    var userToken = await AsyncStorage.getItem('userToken');
    var options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    };
    await fetch(URL_CONFIG.Url + 'api/metrics/settings', options)
      .then(response => response.json())
      .then(responseJson => {
        const newData = responseJson;
        if (newData.success == true) {
          //console.log(data)
          setWarranty(newData.warranty_reserve);
          setContingencyProduct(newData.contingency_product);
          setNetLabourProfit(newData.net_labour_profit);
        } else if (newData.success == false) {
          if (newData.status_code == 401) {
            const asyncStorageKeys = AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
              if (Platform.OS === 'android') {
                AsyncStorage.clear();
              }
              if (Platform.OS === 'ios') {
                AsyncStorage.multiRemove(asyncStorageKeys);
              }
            }
          }
        }
      })
      .catch(error => {
        console.warn(error);
      });
  };

  /**
   * Add product and map products
   */
  function saveAddProduct(item) {
    // Get values from addProductData
    const warrantyValue = warranty;
    const companyId = addProductData.company_id;

    // Calculate the base amount depending on the company_id
    let amountValue = companyId
      ? addProductData.product_cost * 1
      : addProductData.cost * 1;

    // Add the warranty value to the amount
    amountValue += (amountValue * warrantyValue) / 100;

    // Format the amount to two decimal places
    const totalAmount = amountValue.toFixed(2);

    // Create product object
    const product = {
      id: addProductData.id,
      code: addProductData.product_no,
      name: addProductData.name,
      product_type: 'product',
      description: addProductData.des,
      labour_hours: 0,
      quantity: '1',
      employees: [],
      actual_amount: `${
        companyId ? addProductData.product_cost : addProductData.cost
      }`,
      total: totalAmount,
    };

    // Update invoice total
    const newInvoiceTotal =
      parseFloat(invoiceTotalAmount) + parseFloat(totalAmount);
    setInvoiceTotalAmount(newInvoiceTotal);

    // Add the product to the invoice
    invoiceData.products.push(product);

    // Close the products modal and update invoice data
    toggleProductsModal();
    getInvoiceData();
  }

  /**
   * FetchData Service Agreement Api
   */

  const fetchServiceAgreementData = async () => {
    var userToken = await AsyncStorage.getItem('userToken');
    var options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    };
    fetch(URL_CONFIG.Url + 'api/service_agreement', options)
      .then(response => response.json())
      .then(responseJson => {
        const newData = responseJson;
        if (newData.success == true) {
          //console.log(data.service_agreements.data);
          setServiceAgreementData(newData.service_agreements.data);
        } else if (newData.success == false) {
          if (newData.status_code == 401) {
            const asyncStorageKeys = AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
              if (Platform.OS === 'android') {
                AsyncStorage.clear();
              }
              if (Platform.OS === 'ios') {
                AsyncStorage.multiRemove(asyncStorageKeys);
              }
            }
          }
        }
      })
      .catch(error => {
        console.warn(error);
      });
  };

  /**
   * FetchData Inventory Api
   */

  const fetchInventory = async () => {
    var userToken = await AsyncStorage.getItem('userToken');
    var options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    };
    fetch(URL_CONFIG.Url + 'api/inventory', options)
      .then(response => response.json())
      .then(responseJson => {
        const newData = responseJson;
        if (newData.success == true) {
          //console.log(data.service_agreements.data);
          setInventoryData(newData.inventory.data);
        } else if (newData.success == false) {
          if (newData.status_code == 401) {
            const asyncStorageKeys = AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
              if (Platform.OS === 'android') {
                AsyncStorage.clear();
              }
              if (Platform.OS === 'ios') {
                AsyncStorage.multiRemove(asyncStorageKeys);
              }
            }
          }
        }
      })
      .catch(error => {
        console.warn(error);
      });
  };

  /**
   * Fetch Employee data from api
   */

  const FetchEmployeeData = async () => {
    var userToken = await AsyncStorage.getItem('userToken');
    var options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    };
    await fetch(URL_CONFIG.Url + 'api/employees', options)
      .then(response => response.json())
      .then(responseJson => {
        const newData = responseJson;
        if (newData.success == true) {
          // console.log(newData.employees.data);
          setEmployeeData(newData.employees.data);
        } else if (newData.success == false) {
          if (newData.status_code == 401) {
            const asyncStorageKeys = AsyncStorage.getAllKeys();
            if (asyncStorageKeys.length > 0) {
              if (Platform.OS === 'android') {
                AsyncStorage.clear();
              }
              if (Platform.OS === 'ios') {
                AsyncStorage.multiRemove(asyncStorageKeys);
              }
            }
          }
        }
      })
      .catch(error => {
        console.warn(error);
      });
  };

  /**
   * Add Service Agreement to async storage
   */

  function AddServiceAgreement(item) {
    var service_agreement = {
      serviceId: item.id,
      name: item.name,
      serviceQuantity: '1',
      serviceAmount: item.price,
    };
    invoiceTotal = parseInt(invoiceTotalAmount) + item.price;
    setInvoiceTotalAmount(invoiceTotal);
    invoiceData.service_agreements.push(service_agreement);
    setServicesAgreement(false);
    toggleProductsModal();
    getInvoiceData();
  }

  /**
   * Add Inventory to async storage
   */

  function addInventory(item) {
    // Check if the item is already in the inventory
    const itemExists = invoiceData.inventory.some(
      inventoryItem => inventoryItem.inventoryId === item.id,
    );

    // If the item already exists, show an error alert
    if (itemExists) {
      alert('This item is already in the inventory.');
      return; // Exit the function if item already exists
    }

    // If the item does not exist, proceed with adding the item
    var inventory = {
      inventoryId: item.id,
      title: item.title,
      inventoryQuantity: '1',
      reOrderQuantity: item.re_order_quantity,
      inventoryAmount: item.price,
    };

    // Update the total amount
    invoiceTotal = parseInt(invoiceTotalAmount) + item.price;
    setInvoiceTotalAmount(invoiceTotal);

    // Add the item to the inventory
    invoiceData.inventory.push(inventory);
    setInventory(false);

    // Toggle the modal
    toggleProductsModal();

    // Get updated invoice data
    getInvoiceData();
  }

  /**
   * Add Inventory to async storage
   */

  function inventoryQuantityUpdate(newQuantity) {
    return null;
  }

  // Function to handle save from the modal
  const handleUpdateInventory = newQuantity => {
    try {
      // Validate input
      if (!inventoryState?.selectedItem || newQuantity < 0) {
        console.error('Invalid input: selectedItem or newQuantity is invalid');
        return;
      }

      var actual_amount =
        (inventoryState.selectedItem.inventoryAmount || 0) /
        inventoryState.selectedItem.inventoryQuantity;

      // Prepare the updated product data
      const updatedInventory = {
        inventoryId: inventoryState.selectedItem.inventoryId,
        title: inventoryState.selectedItem.title,
        inventoryQuantity: newQuantity,
        reOrderQuantity: inventoryState.selectedItem.reOrderQuantity, // Handle both naming conventions
        inventoryAmount: ((actual_amount || 0) * newQuantity).toFixed(2), // Applied toFixed(2)
      };

      // Update the product in invoiceData
      const inventoryIndex = invoiceData.inventory.findIndex(
        prod => prod.inventoryId === inventoryState.selectedItem.inventoryId, // Fixed item.id to prod.inventoryId
      );

      if (inventoryIndex !== -1) {
        invoiceData.inventory[inventoryIndex] = updatedInventory;
      } else {
        console.warn('Inventory item not found in invoiceData');
        return;
      }

      // Refresh invoice data and reset edit state
      getInvoiceData();
      setInventoryState(prevState => ({
        ...prevState,
        editInventory: false,
      }));
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  /**
   * Add Employee to savever
   */

  async function saveSelectEmployee(item) {
    setEmployee(false);
    setAddEmployee(true);
    var employees = {
      employee_id: `${item.id}`,
      hours: '',
      name: item.fname + ' ' + item.lname,
      cost: item.hourly_wage,
    };
    const isIdExists = selectEmployees.some(
      item => item.employee_id === employees.employee_id,
    );
    if (!isIdExists) {
      selectEmployees.push(employees);
    } else {
      Alert.alert(
        STRING_CONSTANTS.default_alert_box_tittle,
        STRING_CONSTANTS.select_employee_alert_box,
        [{text: 'OK', onPress: () => ''}],
      );
    }
  }

  /**
   * handle input values change function
   */

  const handleChangeUpdateLabor = employee_id => text => {
    setSelectEmployees(prevItems =>
      prevItems.map(item =>
        item.employee_id === employee_id ? {...item, hours: text} : item,
      ),
    );
  };

  const handleNameChange = (text, index) => {
    setSelectEmployees(prevUsers => {
      const updatedUsers = [...prevUsers];
      updatedUsers[index].hours = text;
      return updatedUsers;
    });
  };

  /**
   * save and add product to Employee Cost and Hours
   */

  async function saveAddEmployee() {
    setAddEmployee(false);
    setCustomProduct(true);
    const items = selectEmployees;
    var total_cost_labour = 0;
    var total_hours = 0;
    for (let i = 0; i < items.length; i++) {
      var hours = items[i].hours;
      if (items[i].hours == '' || items[i].hours == null) {
        hours = 0;
      }
      var cost = items[i].cost;
      total_cost_labour += parseFloat(cost) * parseFloat(hours);
      total_hours += parseFloat(hours);
      setEmployeeHours(total_hours);
      setEmployeeCost(total_cost_labour);
    }
  }

  /**
   * create custom product in invoice
   */

  async function saveCustomProduct() {
    // Validate required fields
    if (!productCode) {
      setCustomProductErrorMessage(STRING_CONSTANTS.product_code_required);
    } else if (!description) {
      setCustomProductErrorMessage(STRING_CONSTANTS.description_required);
    } else if (!qty) {
      setCustomProductErrorMessage(STRING_CONSTANTS.product_qty_required);
    } else if (!employeeHours) {
      setCustomProductErrorMessage(STRING_CONSTANTS.total_hour_required);
    } else if (!amount) {
      setCustomProductErrorMessage(STRING_CONSTANTS.amount_required);
    } else {
      // Ensure all the relevant values are properly parsed
      const warrantyValue = parseFloat(warranty) / 100;
      const contingencyProductValue =
        parseFloat(employeeCost) * (parseFloat(contingencyProduct) / 100);
      const netLabourProfitValue =
        parseFloat(employeeCost) * (parseFloat(netLabourProfit) / 100);

      // Add employee cost only once to both contingency and net labor profit
      const totalContingencyAndLabourProfit =
        parseFloat(employeeCost) +
        contingencyProductValue +
        netLabourProfitValue;

      // Calculate amount considering quantity and warranty
      const amountValue =
        parseFloat(amount) * parseInt(qty) +
        parseFloat(amount) * parseInt(qty) * warrantyValue;

      // Total amount (including contingency and labor profit)
      const totalAmount = amountValue + totalContingencyAndLabourProfit;
      const productTotal = totalAmount.toFixed(2);

      // Calculate updated invoice total
      const updatedInvoiceTotal =
        parseFloat(invoiceTotalAmount) + parseFloat(productTotal);
      setInvoiceTotalAmount(updatedInvoiceTotal.toFixed(2));

      // Generate a new product ID
      const newProductId = customProductId + 1;
      setCustomProductId(newProductId);

      // Prepare the new product object
      const product = {
        id: newProductId,
        code: productCode,
        product_type: productStatus,
        name: productName,
        description: description,
        quantity: parseInt(qty),
        labour_hours: parseFloat(employeeHours),
        employees: selectEmployees,
        actual_amount: parseFloat(amount),
        total: productTotal,
      };

      // Add the product to the invoice data
      invoiceData.products.push(product);

      // Toggle modal and refresh invoice data
      toggleProductsModal();
      getInvoiceData();

      // Reset product name field
      setProductName('');
    }
  }

  /**
   * When user press Paid Button and use alert
   */

  const PressPaidAlert = () =>
    Alert.alert(
      STRING_CONSTANTS.default_alert_box_tittle,
      STRING_CONSTANTS.pay_amount_without_signature_alert_box,
      [
        {
          text: 'Cancel',
          onPress: () => '',
        },
        {
          text: 'No',
          onPress: () => setSignaturePad(true),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () =>
            setSubmitAmountModel(true) +
            setPayAmount(false) +
            setPayment_Type(true),
        },
      ],
    );

  const [timerModel, setTimerModel] = useState(false);
  const [clientModel, setClientModel] = useState(false);
  const [submitAmountModel, setSubmitAmountModel] = useState(false);
  const [timer, setTimer] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [client, setClient] = useState(false);
  const [ticket, setTicket] = useState(false);
  const [payment_Type, setPayment_Type] = useState(false);
  const [payAmount, setPayAmount] = useState(false);
  const [popupLabor, setPopupLabor] = useState(false);

  const [defaultForm, setDefaultForm] = useState(true);
  const [catalog, setCatalog] = useState(false);
  const [category, setCategory] = useState(false);
  const [product, setProduct] = useState(false);
  const [customProduct, setCustomProduct] = useState(false);
  const [employee, setEmployee] = useState(false);
  const [addEmployee, setAddEmployee] = useState(false);
  const [servicesAgreement, setServicesAgreement] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [inventoryState, setInventoryState] = useState({
    editInventory: false,
    selectedItem: null,
  });
  const [signaturePad, setSignaturePad] = useState(false);

  /**
   * On create A new Product
   */

  function onCreateProduct() {
    setQty();
    setDescription();
    setAmount();
    setProductCode();
    setEmployeeCost();
    setEmployeeHours();
    setSelectEmployees([]);
  }
  function OnOpenProductModel() {
    setEditString();
    setProductStatus('custom product');
    setDefaultForm(true);
    setCategory(false);
    setProduct(false);
    setCustomProduct(false);
    setEmployee(false);
    setAddEmployee(false);
    setServicesAgreement(false);
    toggleProductsModal();
    onCreateProduct();
  }

  /**
   * Select timer model (CompoNet)
   */

  function ToggleBarMenu() {
    return (
      <ScrollView>
        <TouchableOpacity
          onPress={() =>
            ticketStatusChangeAlertBox((status = 'decline')) +
            setTimerModel(false) +
            setToggleMenu(false)
          }
          style={styles.SelectTimerDropDown}>
          <Text style={styles.SelectTimerDropDownText}>
            {STRING_CONSTANTS.decline}
          </Text>
        </TouchableOpacity>
        {Status == 5 ? (
          <></>
        ) : (
          <TouchableOpacity
            style={styles.SelectTimerDropDown}
            onPress={() =>
              ticketStatusChangeAlertBox((status = 'suspend')) +
              setTimerModel(false) +
              setToggleMenu(false)
            }>
            <Text style={styles.SelectTimerDropDownText}>
              {STRING_CONSTANTS.suspend}
            </Text>
          </TouchableOpacity>
        )}

        {/* <TouchableOpacity
          onPress={() =>
            ticketStatusChangeAlertBox((status = 'lock')) +
            setTimerModel(false) +
            setToggleMenu(false)
          }
          style={styles.SelectTimerDropDown}>
          <Text style={styles.SelectTimerDropDownText}>Lock</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() =>
            productsTotal == 0
              ? Alert.alert(
                  STRING_CONSTANTS.default_alert_box_tittle,
                  STRING_CONSTANTS.add_product_alert_box,
                  [{text: 'OK', onPress: () => ''}],
                ) +
                setTimerModel(false) +
                setToggleMenu(false)
              : isTdActive == true &&
                isJobActive == true &&
                isBreakActive == true
              ? Alert.alert(
                  STRING_CONSTANTS.default_alert_box_tittle,
                  STRING_CONSTANTS.stop_timer_alert_box,
                  [{text: 'OK', onPress: () => ''}],
                ) +
                setTimerModel(false) +
                setToggleMenu(false)
              : convertToInvoice() + setTimerModel(false) + setToggleMenu(false)
          }
          style={styles.SelectTimerDropDown}>
          <Text style={styles.SelectTimerDropDownText}>Convert to Invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTimerModel(false) + setToggleMenu(false)}
          style={styles.SelectTimerDropDown}>
          <Text style={styles.SelectTimerDropDownText}>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  /**
   * Select timer model (CompoNet)
   */
  function selectTimeComponent() {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            isJobActive == true || isBreakActive == true
              ? Alert.alert(
                  STRING_CONSTANTS.default_alert_box_tittle,
                  STRING_CONSTANTS.stop_timer_alert_box,
                  [{text: 'OK', onPress: () => ''}],
                ) + setTimerModel(false)
              : setSelectedTimer('T&D Time') + setTimerModel(false)
          }
          style={styles.SelectTimerDropDown}>
          <Text style={styles.SelectTimerDropDownText}>T&D Time</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.SelectTimerDropDown}
          onPress={() =>
            isTdActive == true || isBreakActive == true
              ? setTimerModel(false) +
                Alert.alert(
                  STRING_CONSTANTS.default_alert_box_tittle,
                  STRING_CONSTANTS.stop_timer_alert_box,
                  [{text: 'OK', onPress: () => ''}],
                )
              : setSelectedTimer('Job Time') + setTimerModel(false)
          }>
          <Text style={styles.SelectTimerDropDownText}>Job Time</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            isTdActive == true || isJobActive == true
              ? setTimerModel(false) +
                Alert.alert(
                  STRING_CONSTANTS.default_alert_box_tittle,
                  STRING_CONSTANTS.stop_timer_alert_box,
                  [{text: 'OK', onPress: () => ''}],
                )
              : setSelectedTimer('Break Time') + setTimerModel(false)
          }
          style={styles.SelectTimerDropDown}>
          <Text style={styles.SelectTimerDropDownText}>Break Time</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Select Client Model (Component)
   */

  function clientViewComponent() {
    return (
      <>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setClientModel(false)}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 3,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}> Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}> Select A Client</Text>
            <View></View>
            <Text style={styles.SelectClientPopUpTittle}> </Text>
          </View>
        </LinearGradient>
        <View style={styles.MainContainerClientList}>
          <TextInput
            placeholder={STRING_CONSTANTS.search_client_name}
            placeholderTextColor={'#666666'}
            style={styles.SearchBar}
            value={searchQuery}
            onChangeText={text => {
              SearchFetch(text);
              setSearchQuery(text);
            }}
          />
          <FlatList
            data={clientListData}
            keyExtractor={(item, index) => index}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  setInvoiceClient(item) + setClient(false) + setTicket(true)
                }
                style={styles.ClientMainContainer}>
                <View style={styles.RowItemContainerCenter}>
                  <Image
                    style={{tintColor: 'gray', height: 40, width: 40}}
                    source={require('./assets/star.png')}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setInvoiceClient(item) +
                      setClient(false) +
                      setTicket(true)
                    }
                    style={{marginHorizontal: 30}}>
                    <Text style={styles.ClientDataName}>
                      {item.fname} {item.lname}
                    </Text>
                    <Text style={styles.ClientDataDetail}>{item.email}</Text>
                    <Text style={styles.ClientDataDetail}>
                      +{item.phone_no_1}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Image
                  style={{tintColor: 'gray', height: 40, width: 40}}
                  source={require('./assets/CollapsibleIcon.png')}
                />
              </TouchableOpacity>
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={moreDataLoading ? renderFooter : null}
          />
        </View>
      </>
    );
  }

  /**
   * Select Ticket Type Model (Component)
   */

  function ticketTypeComponent() {
    return (
      <View style={{flex: 1}}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setTicket(false) + setClient(true)}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}> Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}> Select Ticket Type</Text>
            <View></View>
            <Text style={styles.SelectClientPopUpTittle}> </Text>
          </View>
        </LinearGradient>
        <FlatList
          data={ticketTypeData}
          keyExtractor={(item, index) => index}
          renderItem={({item}) => (
            <>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    selectTicket(item) +
                    setTicket(false) +
                    setClientModel(false)
                  }
                  style={styles.SelectTicketTypeButton}>
                  <Text style={styles.SelectTicketTypeText}>{item.des}</Text>
                  <Image
                    style={{height: 30, width: 30, tintColor: 'gray'}}
                    source={require('./assets/check.png')}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        />
      </View>
    );
  }

  /**
   * Select Payment Type Model (Component)
   */

  function paymentTypeComponent() {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setSubmitAmountModel(false)}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}> Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}> Select PaymentType</Text>
            <View></View>
            <Text style={styles.SelectClientPopUpTittle}> </Text>
          </View>
        </LinearGradient>
        <TouchableOpacity
          onPress={() =>
            setPayment_Type(false) +
            setPayAmount(true) +
            setPaymentType('Cash') +
            calculateTotalPay((text = productsTotal)) +
            setTotalPay(productsTotal) +
            setErrorMessage('')
          }
          style={styles.PaymentTypeContainer}>
          <Text style={styles.SelectTicketTypeText}>Cash</Text>
          <Image
            style={{height: 30, width: 30, tintColor: 'gray'}}
            source={require('./assets/check.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setPayment_Type(false) +
            setPayAmount(true) +
            setPaymentType('Credit Card') +
            calculateTotalPay((text = productsTotal)) +
            setTotalPay(productsTotal) +
            setErrorMessage('')
          }
          style={styles.PaymentTypeContainer}>
          <Text style={styles.SelectTicketTypeText}>Credit Card</Text>
          <Image
            style={{height: 30, width: 30, tintColor: 'gray'}}
            source={require('./assets/check.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setPayment_Type(false) +
            setPayAmount(true) +
            setPaymentType('Check') +
            calculateTotalPay((text = productsTotal)) +
            setTotalPay(productsTotal) +
            setErrorMessage('')
          }
          style={styles.PaymentTypeContainer}>
          <Text style={styles.SelectTicketTypeText}>Check</Text>
          <Image
            style={{height: 30, width: 30, tintColor: 'gray'}}
            source={require('./assets/check.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Pay Amount Model (Component)
   */

  function payPaymentComponent() {
    return (
      <View style={{flex: 1}}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setPayAmount(false) + setPayment_Type(true)}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}>Amount</Text>
            <TouchableOpacity
              onPress={() =>
                isTdActive == true ||
                isJobActive == true ||
                isBreakActive == true
                  ? Alert.alert(
                      STRING_CONSTANTS.default_alert_box_tittle,
                      STRING_CONSTANTS.stop_timer_alert_box,
                      [{text: 'OK', onPress: () => ''}],
                    ) + setSubmitAmountModel(false)
                  : setSubmitAmountModel(false) + convertToInvoice()
              }
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <ScrollView style={{marginTop: 5}}>
          {paymentType == 'Check' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 5,
              }}>
              <View
                style={{
                  width: '50%',
                  height: '100%',
                  paddingHorizontal: 30,
                  backgroundColor: '#f9fbee',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottomWidth: 0.3,
                  borderColor: '#999999',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: 'black',
                    fontFamily: 'DMSans-Bold',
                    paddingHorizontal: 30,
                    paddingVertical: 20,
                  }}>
                  Cheque Number
                </Text>
              </View>
              <TextInput
                keyboardType="numeric"
                autoCorrect={false}
                placeholder={STRING_CONSTANTS.check_number}
                placeholderTextColor="#555555"
                value={checkNumber}
                onChangeText={checkNumber => setCheckNumber(checkNumber)}
                style={styles.TotalAmountInput}
              />
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 5,
            }}>
            <View
              style={{
                width: '50%',
                height: '100%',
                paddingHorizontal: 30,
                backgroundColor: '#f9fbee',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottomWidth: 0.3,
                borderColor: '#999999',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'DMSans-Bold',
                  paddingHorizontal: 30,
                  paddingVertical: 20,
                }}>
                Amount
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              autoCorrect={false}
              placeholder="$00.00"
              placeholderTextColor="#555555"
              value={totalPay}
              onChangeText={text => {
                calculateTotalPay(text);
                setTotalPay(text);
                setErrorMessage('');
              }}
              style={styles.TotalAmountInput}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  /**
   * return to error message function
   */

  function ProductErrorMessageComponent() {
    if (customProductErrorMessage) {
      return (
        <Text style={styles.ProductErrorMessage}>
          {' '}
          {customProductErrorMessage}{' '}
        </Text>
      );
    }
  }

  /**
   * user view show date picker
   */

  function DatePickerComponent() {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity onPress={showDatePickerIos}>
          <LinearGradient
            colors={theme.colors.header_button_linear_gradient}
            style={{
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              borderRadius: 5,
              paddingVertical: 2,
              paddingHorizontal: 15,
            }}>
            <View style={styles.DateMainContainer}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 16,
                  margin: 5,
                  fontFamily: 'DMSans-Medium',
                }}>
                {selectedDate
                  ? selectedDate.toLocaleDateString()
                  : 'No date selected'}
              </Text>
            </View>
            <DateTimePickerModal
              date={selectedDate}
              isVisible={datePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </LinearGradient>
        </TouchableOpacity>
      );
    } else {
      return (
        <>
          {/* Date Picker */}
          <LinearGradient
            colors={theme.colors.header_button_linear_gradient}
            style={{
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              borderRadius: 5,
              paddingVertical: 8,
              paddingHorizontal: 8,
            }}>
            <TouchableOpacity
              style={styles.DateMainContainer}
              onPress={() => showMode('date')}>
              <Text style={styles.Date}>{date}</Text>
              {show && (
                <RNDateTimePicker
                  testID="dateTimePicker"
                  value={invoiceDate}
                  mode={mode}
                  is24Hour={true}
                  display={'default'}
                  onChange={invoiceDateOnChange}
                />
              )}
            </TouchableOpacity>
          </LinearGradient>
          {/* Date Picker End */}
        </>
      );
    }
  }

  /**
   * popup default select Form (Component)
   */

  function DefaultFormComponent() {
    return (
      <View style={styles.productModelContainer}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => toggleProductsModal()}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}> Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}>Product</Text>
            <View></View>
            <Text style={styles.SelectClientPopUpTittle}> </Text>
          </View>
        </LinearGradient>
        <ScrollView style={{flex: 1}}>
          <View style={styles.MainContainerProductsData}>
            <TouchableOpacity
              style={styles.BoxContainer}
              onPress={() =>
                setDefaultForm(false) +
                setCustomProduct(true) +
                FetchCatalogData()
              }>
              <Text style={styles.CatalogNameText}>Custom Entry</Text>
              <Image
                style={styles.Icon}
                source={require('./assets/CollapsibleIcon.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.BoxContainer}
              onPress={() => setDefaultForm(false) + setCatalog(true)}>
              <Text style={styles.CatalogNameText}>Add Product</Text>
              <Image
                style={styles.Icon}
                source={require('./assets/CollapsibleIcon.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.BoxContainer}
              onPress={() =>
                setDefaultForm(false) + setServicesAgreement(true)
              }>
              <Text style={styles.CatalogNameText}>Services Agreement</Text>

              <Image
                style={styles.Icon}
                source={require('./assets/CollapsibleIcon.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.BoxContainer}
              onPress={() => setDefaultForm(false) + setInventory(true)}>
              <Text style={styles.CatalogNameText}>Inventory</Text>

              <Image
                style={styles.Icon}
                source={require('./assets/CollapsibleIcon.png')}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  /**
   * popup select Catalog (Component)
   */

  function CatalogComponent() {
    return (
      <View style={styles.productModelContainer}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setCatalog(false) + setDefaultForm(true)}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}>Catalogs</Text>
            <TouchableOpacity
              onPress={() => toggleProductsModal()}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={{flex: 1, marginTop: 10}}>
          {CatalogData ? (
            <FlatList
              data={CatalogData}
              keyExtractor={(item, index) => index}
              renderItem={({item}) => (
                <View style={styles.MainContainerProductsData}>
                  <TouchableOpacity
                    style={styles.BoxContainer}
                    onPress={() => FetchCategoryData(item)}>
                    <Text style={styles.CatalogNameText}>
                      {item.manufacturer_name}
                      {item.des}
                      {item.name}
                    </Text>

                    <Image
                      style={styles.Icon}
                      source={require('./assets/CollapsibleIcon.png')}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <ActivityIndicator size={30} color="#000000" />
          )}
        </View>
      </View>
    );
  }

  /**
   * popup select Category (Component)
   */

  function CategoryComponent() {
    return (
      <View style={styles.productModelContainer}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setCategory(false) + setCatalog(true)}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}>Select A Category</Text>
            <TouchableOpacity
              onPress={() => toggleProductsModal()}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {ManufacturerName ? (
          <Text style={styles.ManufacturerName}>
            {ManufacturerName.catalog_manufacturer_name}
          </Text>
        ) : (
          <></>
        )}
        <View style={{flex: 1, marginTop: 10}}>
          {categoryData ? (
            <FlatList
              data={categoryData}
              keyExtractor={(item, index) => index}
              renderItem={({item}) => (
                <View style={styles.MainContainerProductsData}>
                  <TouchableOpacity
                    style={styles.BoxContainer}
                    onPress={() => fetchProductsData(item)}>
                    <Text style={styles.CatalogNameText}>
                      {item.manufacturer_name}
                      {item.des}
                      {item.name}
                    </Text>
                    <Image
                      style={styles.Icon}
                      source={require('./assets/CollapsibleIcon.png')}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
          ) : (
            <ActivityIndicator size={30} color="#000000" />
          )}
        </View>
      </View>
    );
  }

  /**
   * Product View (Component)
   */

  function ProductComponent() {
    return (
      <View style={styles.productModelContainer}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                setProduct(false) + setCategory(true) + setPopupLabor(false)
              }
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}>Products</Text>
            <TouchableOpacity
              onPress={() => toggleProductsModal()}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {ManufacturerName ? (
          <Text style={styles.ManufacturerName}>
            {ManufacturerName.catagory_manufacturer_name}
          </Text>
        ) : (
          <></>
        )}

        <View style={{flex: 1, marginTop: 10}}>
          {productData ? (
            <FlatList
              data={productData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <View style={styles.MainContainerProductsData}>
                  <TouchableOpacity
                    activeOpacity={popupLabor == true ? 0.7 : 0}
                    style={styles.BoxContainer}
                    onPress={() =>
                      setPopupLabor(!popupLabor) + setAddProductData(item)
                    }>
                    <Text style={styles.CatalogNameText}>
                      {item.id}
                      {'/'}
                      {item.name}
                    </Text>
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        resizeMode: 'contain',
                        tintColor: theme.colors.primary,
                      }}
                      source={require('./assets/add.png')}
                    />
                  </TouchableOpacity>
                </View>
              )}
              ListFooterComponent={loadingProduct ? <FooterLoader /> : null}
              onEndReached={handleLoadMoreProduct}
              onEndReachedThreshold={0.5}
            />
          ) : (
            <ActivityIndicator size={30} color="#000000" />
          )}
        </View>
      </View>
    );
  }

  /**
   * popup select CustomProduct form (Component)
   */

  function CustomProductComponent() {
    return (
      <View style={styles.productModelContainer}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                editString
                  ? toggleProductsModal()
                  : setCustomProduct(false) + setDefaultForm(true)
              }
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>
                  {editString ? 'Cancel' : 'Back'}{' '}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}>
              {editString ? 'Edit Product' : 'Custom Products'}
            </Text>
            <TouchableOpacity
              onPress={() =>
                editString ? productUpdateState() : saveCustomProduct()
              }
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={{flex: 1}}>
          <View style={styles.customProductMainContainer}>
            <Text style={styles.InputLabels}>
              {STRING_CONSTANTS.product_code_label}
            </Text>
            <TextInput
              editable={productStatus == 'custom product' ? true : false}
              keyboardType="default"
              autoCorrect={false}
              placeholder="0"
              placeholderTextColor="#000000"
              value={productCode}
              onChangeText={ProductCode => {
                setProductCode(ProductCode);
                setCustomProductErrorMessage('');
              }}
              style={styles.customProductInput}
            />
          </View>
          <View style={styles.customProductInputContainer}>
            <Text style={styles.InputLabels}>
              {STRING_CONSTANTS.description_label}
            </Text>
            <TextInput
              editable={productStatus == 'custom product' ? true : false}
              keyboardType="default"
              autoCorrect={false}
              placeholder={STRING_CONSTANTS.description_label}
              placeholderTextColor="#000000"
              value={description}
              onChangeText={description => {
                setDescription(description);
                setCustomProductErrorMessage('');
              }}
              style={styles.customProductInput}
            />
          </View>
          <View style={styles.customProductInputContainer}>
            <Text style={styles.InputLabels}>
              {STRING_CONSTANTS.product_quantity}
            </Text>
            <TextInput
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#000000"
              value={qty}
              onChangeText={qty => {
                setQty(qty);
                setCustomProductErrorMessage('');
              }}
              style={styles.customProductInput}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 30,
              paddingVertical: 8,
              borderBottomWidth: 0.5,
              borderColor: '#B2B9BF',
            }}>
            <Text style={styles.InputLabels}>
              {STRING_CONSTANTS.labor_label}
            </Text>
            <TouchableOpacity
              style={styles.customProductInput}
              onPress={() => toggleAddEmployeeModal()}>
              {employeeHours ? (
                <Text style={styles.InputLabels}>{employeeHours}</Text>
              ) : (
                <Text style={styles.InputLabels}>0</Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.customProductInputContainer}>
            <Text style={styles.InputLabels}>
              {STRING_CONSTANTS.amount_label}
            </Text>
            <TextInput
              editable={productStatus == 'custom product' ? true : false}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#000000"
              value={amount}
              onChangeText={total => {
                setAmount(total);
                setCustomProductErrorMessage('');
              }}
              style={styles.customProductInput}
            />
          </View>
          {ProductErrorMessageComponent()}
        </ScrollView>
      </View>
    );
  }

  /**
   * popup select and add Add Employee  (Component)
   */

  function addEmployeeComponent() {
    return (
      <View style={styles.productModelContainer}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() =>
                saveAddEmployee() +
                setAddEmployee(false) +
                setCustomProduct(true)
              }
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}>Add Employee</Text>
            <TouchableOpacity
              onPress={() => saveAddEmployee()}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{flex: 1, marginTop: 10}}>
          <ScrollView>
            <TouchableOpacity
              onPress={() => setAddEmployee(false) + setEmployee(true)}>
              <Text
                style={{
                  fontSize: 15,
                  paddingVertical: 10,
                  textAlign: 'center',
                  color: 'black',
                  fontFamily: 'DMSans-Bold',
                  width: '91%',
                  backgroundColor: '#fff',
                  borderRadius: 5,
                  alignSelf: 'center',
                  borderWidth: 1,
                  borderColor: '#B2B9BF',
                  margin: 10,
                }}>
                Select Employee
              </Text>
            </TouchableOpacity>

            {selectEmployees ? (
              <>
                {selectEmployees.map((item, index) => (
                  <View key={item.employee_id}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                        borderBottomWidth: 0.5,
                        borderColor: '#B2B9BF',
                      }}>
                      <Text
                        style={{
                          color: '#000000',
                          fontFamily: 'DMSans-Medium',
                          fontSize: 17,
                          textAlign: 'center',
                        }}>
                        {item.name}
                      </Text>
                      <TextInput
                        keyboardType="numeric"
                        placeholder="0"
                        placeholderTextColor="#000000"
                        value={`${item.hours}`}
                        // onChangeText={handleChangeUpdateLabor(item.employee_id)}
                        onChangeText={text => handleNameChange(text, index)}
                        style={{
                          color: 'black',
                          fontSize: 17,
                          fontFamily: 'DMSans-Medium',
                          alignSelf: 'center',
                          backgroundColor: '#FFFFFF',
                          paddingVertical: 15,
                          paddingHorizontal: 20,
                          width: '50%',
                          backgroundColor: '#f9fbee',
                          borderWidth: 0.5,
                          borderColor: '#B2B9BF',
                          borderRadius: 5,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <></>
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  /**
   * popup select Employee  (Component)
   */

  function selectEmployeeComponent() {
    return (
      <View style={styles.productModelContainer}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setEmployee(false) + setAddEmployee(true)}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}> Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}>Select Employee</Text>
            <View></View>
            <Text style={styles.SelectClientPopUpTittle}> </Text>
          </View>
        </LinearGradient>

        <View style={{flex: 1}}>
          {employeeData ? (
            <ScrollView>
              {employeeData.map((item, index) => (
                <View key={item.id}>
                  <TouchableOpacity
                    onPress={() => saveSelectEmployee(item)}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 30,
                      paddingVertical: 15,
                      borderBottomWidth: 1,
                      borderColor: '#B2B9BF',
                      backgroundColor: '#fffef9',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#000000',
                        fontFamily: 'DMSans-Medium',
                        fontSize: 17,
                        textAlign: 'center',
                      }}>
                      {item.fname} {item.lname}
                    </Text>
                    <Image
                      style={{
                        width: 30,
                        height: 30,
                        resizeMode: 'contain',
                        tintColor: theme.colors.primary,
                      }}
                      source={require('./assets/add.png')}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <ActivityIndicator size={30} color="#000000" />
          )}
        </View>
      </View>
    );
  }

  /**
   * Services Agreement Component View
   */

  function ServicesAgreementComponent() {
    return (
      <View style={styles.productModelContainer}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setServicesAgreement(false) + setDefaultForm(true)}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}>Service Agreement</Text>
            <TouchableOpacity
              onPress={() =>
                setServicesAgreement(false) + setProductsModal(false)
              }
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}> Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{flex: 1, marginTop: 10}}>
          {serviceAgreementData ? (
            <FlatList
              data={serviceAgreementData}
              keyExtractor={(item, index) => index}
              renderItem={({item}) => (
                <>
                  <TouchableOpacity
                    style={styles.ServiceAgreementDataContainer}
                    onPress={() => AddServiceAgreement(item)}>
                    <View style={styles.Data}>
                      <Text style={styles.ServiceAgreementProductNameText}>
                        {item.name}
                      </Text>
                      <Text style={styles.ServiceAgreementDesText}>
                        {item.des}
                      </Text>
                      <Text style={styles.ServiceAgreementPriceText}>
                        ${item.price}
                      </Text>
                    </View>
                    <Image
                      style={styles.ServiceAgreementAddIcon}
                      source={require('./assets/FloatingButton.png')}
                    />
                  </TouchableOpacity>
                </>
              )}
            />
          ) : (
            <ActivityIndicator size={30} color="#000000" />
          )}
        </View>
      </View>
    );
  }

  /**
   * Services Agreement Component View
   */
  const getStatusStyle = (qty, reOrderQuantity) => {
    if (qty == 0) {
      return styles.outOfStock;
    } else if (Number(qty) <= Number(reOrderQuantity)) {
      return styles.lowStock;
    } else {
      return styles.inStock;
    }
  };

  const getStatusTextColor = qty => {
    return qty == 0 ? '#fff' : '#000';
  };

  function inventoryComponent() {
    return (
      <View style={styles.productModelContainer}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setInventory(false) + setDefaultForm(true)}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}>Inventory</Text>
            <TouchableOpacity
              onPress={() => setInventory(false) + setProductsModal(false)}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}> Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={{flex: 1, marginTop: 10}}>
          {inventoryData ? (
            <FlatList
              data={inventoryData}
              keyExtractor={(item, index) => index}
              renderItem={({item}) => (
                <>
                  <TouchableOpacity
                    style={styles.ServiceAgreementDataContainer}
                    onPress={() => addInventory(item)}>
                    <View style={styles.Data}>
                      <Text style={styles.ServiceAgreementProductNameText}>
                        {item.title}
                      </Text>
                      <Text style={styles.ServiceAgreementDesText}>
                        Quantity: {item.quantity}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          getStatusStyle(item.quantity, item.re_order_quantity),
                        ]}>
                        <Text
                          style={[
                            styles.statusText,
                            {color: getStatusTextColor(item.quantity)},
                          ]}>
                          Re Order Qty: {item.re_order_quantity}
                        </Text>
                      </View>

                      <Text style={styles.ServiceAgreementPriceText}>
                        ${item.price}
                      </Text>
                    </View>
                    <Image
                      style={styles.ServiceAgreementAddIcon}
                      source={require('./assets/FloatingButton.png')}
                    />
                  </TouchableOpacity>
                </>
              )}
            />
          ) : (
            <ActivityIndicator size={30} color="#000000" />
          )}
        </View>
      </View>
    );
  }

  /**
   * save invoice when user fill and convert to invoice user View
   */

  function SubmitAmountComponent() {
    return (
      <View style={styles.SubmitMainContainer}>
        <TextInput
          style={{
            padding: 10,
            width: '48%',
            height: '100%',
            backgroundColor: '#fff',
            borderRadius: 5,
            borderColor: 'gray',
            borderWidth: 1,
          }}
          editable={isActiveView == true ? true : false}
          multiline={true}
          numberOfLines={4}
          autoCorrect={false}
          placeholder="Comments"
          placeholderTextColor="gray"
          value={note}
          onChangeText={note => setNote(note)}
          keyboardType="default"
        />
        <View style={{width: '50%', height: '100%'}}>
          <TouchableOpacity
            onPress={() => {
              isActiveView == true
                ? productsTotal == 0
                  ? Alert.alert(
                      STRING_CONSTANTS.default_alert_box_tittle,
                      STRING_CONSTANTS.add_product_alert_box,
                      [{text: 'OK', onPress: () => ''}],
                    )
                  : signature
                  ? setSubmitAmountModel(true) +
                    setPayAmount(false) +
                    setPayment_Type(true)
                  : PressPaidAlert()
                : Alert.alert(
                    STRING_CONSTANTS.default_alert_box_tittle,
                    STRING_CONSTANTS.select_client_alert_box,
                    [{text: 'OK', onPress: () => ''}],
                  );
            }}
            activeOpacity={0.7}
            style={styles.PaidAmountMainContainer}>
            <View style={styles.PaidAmountSubContainer}>
              <Text
                style={[styles.PaidAmountHeadingText, {flex: 1.5}]}
                numberOfLines={1}>
                Service Agreements
              </Text>
              <Text
                style={[styles.PaidAmountValueText, {flex: 1}]}
                numberOfLines={1}>
                $ {serviceAgreementTotal ? serviceAgreementTotal : '0.00'}
              </Text>
            </View>
            <View style={styles.PaidAmountSubContainer}>
              <Text
                style={[styles.PaidAmountHeadingText, {flex: 1.5}]}
                numberOfLines={1}>
                Total
              </Text>
              <Text style={[styles.PaidAmountValueText, {flex: 1}]}>
                $ {productsTotal == 0 ? '0.00' : productsTotal}
              </Text>
            </View>
            <View style={styles.PaidAmountSubContainer}>
              <Text
                style={[styles.PaidAmountHeadingText, {flex: 1.5}]}
                numberOfLines={1}>
                Paid
              </Text>
              <Text
                style={[styles.PaidAmountValueText, {flex: 1}]}
                numberOfLines={1}>
                $ {totalPay ? totalPay : '0.00'}
              </Text>
            </View>
            <View style={styles.PaidAmountSubContainer}>
              <Text
                style={[styles.PaidAmountSignText, {flex: 1.5}]}
                numberOfLines={1}>
                Balance Due
              </Text>
              <Text
                numberOfLines={1}
                style={[styles.PaidAmountSignText, {flex: 1}]}>
                $ {balance ? balance : '0.00'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.SignatureButton}
            onPress={() => {
              isActiveView == true
                ? productsTotal == 0
                  ? Alert.alert(
                      STRING_CONSTANTS.default_alert_box_tittle,
                      STRING_CONSTANTS.add_product_alert_box,
                      [{text: 'OK', onPress: () => ''}],
                    )
                  : setSignaturePad(true)
                : Alert.alert(
                    STRING_CONSTANTS.default_alert_box_tittle,
                    STRING_CONSTANTS.select_client_alert_box,
                    [{text: 'OK', onPress: () => ''}],
                  );
            }}>
            <Text style={styles.PaidAmountValueText} numberOfLines={1}>
              Signature
            </Text>
          </TouchableOpacity>
          {ReturnErrorMessageComponent()}
          {signature ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 5,
                backgroundColor: '#fff',
                marginTop: 10,
                borderColor: 'gray',
                borderWidth: 0.5,
                borderRadius: 2,
              }}>
              <Image
                style={{height: 100, width: 100, alignSelf: 'center'}}
                source={{uri: `data:image/png;base64,${signature}`}}
              />
            </View>
          ) : null}
        </View>
      </View>
    );
  }

  /**
   * popup Draw signature  (Component)
   */

  function SignatureCaptureComponent() {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setSignaturePad(false);
              }}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.TittleClientList}></Text>
            <TouchableOpacity
              onPress={() => {
                saveSign();
              }}
              style={styles.PopUpCancelButton}>
              <LinearGradient
                colors={theme.colors.header_button_linear_gradient}
                style={{
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                <Text style={styles.SelectClientText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 18,
            paddingVertical: 10,
            paddingHorizontal: 20,
            fontFamily: 'DMSans-bold',
            backgroundColor: '#9b9b9b',
            color: '#fff',
          }}>
          <Text
            style={{
              fontSize: 18,
              paddingVertical: 5,
              paddingHorizontal: 20,
              fontFamily: 'DMSans-bold',

              color: '#fff',
            }}>
            Please sign using finger or stylus
          </Text>
          <TouchableOpacity
            onPress={() => {
              resetSign();
            }}
            style={{
              paddingVertical: 5,
              textAlign: 'center',
              fontFamily: 'DMSans-Bold',
              backgroundColor: '#2c2c2c',
              borderRadius: 5,
            }}>
            <LinearGradient
              colors={theme.colors.header_button_linear_gradient}
              style={{
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
                borderRadius: 5,
                paddingVertical: 3,
                paddingHorizontal: 20,
              }}>
              <Text style={styles.SelectClientText}>Clear</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1, alignItems: 'center', margin: 20}}>
          <SignatureCapture
            style={{
              borderColor: 'black',
              borderWidth: 2,
              width: 400,
              height: 400,
            }}
            ref={sign}
            onSaveEvent={_onSaveEvent}
            onDragEvent={_onDragEvent}
            showNativeButtons={false}
            showTitleLabel={false}
          />
        </View>
        <LinearGradient
          colors={theme.colors.header_linear_gradient}
          style={{paddingHorizontal: 15, paddingVertical: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.TittleClientList}>Ticket Total Amount:</Text>
            <Text style={styles.TittleClientList}>${productsTotal}</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  /**
   * return error message when invoice un fill  and field is required (Component)
   */

  function ReturnErrorMessageComponent() {
    if (errorMessage) {
      return <Text style={styles.ErrorMessage}>{errorMessage}</Text>;
    }
  }

  /**
   * user Bottom tab bar view (Component)
   */

  /**
   * Convert to Invoice and ticketSuspend save data database Post Api
   */

  async function ticketSuspendApi() {
    var userToken = await AsyncStorage.getItem('userToken');
    if (!invoiceData.client.id) {
      alert(STRING_CONSTANTS.client_required);
      setErrorMessage(STRING_CONSTANTS.client_required);
    } else if (!ticketTypeId) {
      alert(STRING_CONSTANTS.ticket_type_required);
      setErrorMessage(STRING_CONSTANTS.ticket_type_required);
    } else {
      toggleLoading();
      fetch(URL_CONFIG.Url + 'api/invoices/save', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          ticket_id: ticketId,
          ticket_type_id: ticketTypeId,
          status: ticketStatus ? ticketStatus : 'ticket',
          client_id: invoiceData.client.id,
          products: invoiceData.products,
          service_agreement: invoiceData.service_agreements,
          inventory: invoiceData.inventory,
          timesheetAmount: invoiceData.timeSheet[0].total_amount,
          jobTime: invoiceData.timeSheet[0].job_time,
          travelTime: invoiceData.timeSheet[0].td_time,
          pauseTime: invoiceData.timeSheet[0].pause_time,
          total: productsTotal,
          paid: totalPay,
          payment_method: paymentType,
          balance: balance,
          cheque_no: checkNumber,
          ticketDate: date,
          ticket_closed: null,
          ticket_suspend: 'suspend',
          signature: signature,
          notes: note,
          success: 'true',
        }),
      })
        .then(response => response.json())
        .then(async data => {
          //toggleLoading();
          setLoading(false);
          //console.log(data);
          if (data.success == true) {
            navigation.navigate(NAVIGATION_STRING_CONSTANTS.details_screen);
            Alert.alert(data.message);
          } else {
            console.log(data.message);
          }
        })
        .catch(error => {
          console.warn(error);
        });
    }
  }

  /**
   * Convert to Invoice and save data database Post Api
   */

  async function convertToInvoice(locked) {
    // Using let/const for variable declaration
    const lockedValue = locked || null;

    try {
      // Retrieving userToken from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');

      // Validating inputs
      if (!invoiceData.client.id) {
        alert(STRING_CONSTANTS.client_required);
        setErrorMessage(STRING_CONSTANTS.client_required);
        return;
      }
      if (!ticketTypeId) {
        alert(STRING_CONSTANTS.ticket_type_required);
        setErrorMessage(STRING_CONSTANTS.ticket_type_required);
        return;
      }
      if (productsTotal === 0) {
        return null;
      }
      if (!totalPay) {
        alert(STRING_CONSTANTS.total_pay_required);
        setErrorMessage(STRING_CONSTANTS.total_pay_required);
        return;
      }
      if (!paymentType) {
        alert(STRING_CONSTANTS.payment_type_required);
        setErrorMessage(STRING_CONSTANTS.payment_type_required);
        return;
      }

      // Toggling loading state
      toggleLoading();

      // Making API call to save invoice
      const response = await fetch(URL_CONFIG.Url + 'api/invoices/save', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          ticket_id: ticketId,
          ticket_type_id: ticketTypeId,
          status: ticketStatus ? ticketStatus : 'ticket',
          client_id: invoiceData.client.id,
          products: invoiceData.products,
          service_agreement: invoiceData.service_agreements,
          inventory: invoiceData.inventory,
          timesheetAmount: invoiceData.timeSheet[0].total_amount,
          jobTime: invoiceData.timeSheet[0].job_time,
          travelTime: invoiceData.timeSheet[0].td_time,
          pauseTime: invoiceData.timeSheet[0].pause_time,
          total: productsTotal,
          paid: totalPay,
          payment_method: paymentType,
          balance: balance,
          cheque_no: checkNumber,
          ticketDate: date,
          ticket_locked: lockedValue,
          ticket_suspend: null,
          ticket_closed: 'closed',
          signature: signature,
          notes: note,
          success: 'true',
        }),
      });

      // Parsing the response
      const data = await response.json();

      // Checking response status
      if (data.success) {
        setLoading(false);
        navigation.navigate(NAVIGATION_STRING_CONSTANTS.details_screen);
        Alert.alert(data.message);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      // Handle error
      console.warn(error);
      setLoading(false); // Stop loading if error occurs
    }
  }

  /**
   * Convert to Invoice and save data database Post Api
   */

  const convertToDraft = async () => {
    try {
      // Retrieving userToken from AsyncStorage
      const userToken = await AsyncStorage.getItem('userToken');

      // Validating inputs
      if (!invoiceData.client.id) {
        return;
      }
      if (!ticketTypeId) {
        return;
      }

      if (
        Status == 1 ||
        Status == 6 ||
        Status === undefined ||
        Status === null
      ) {
        // Making API call to save invoice
        const response = await fetch(URL_CONFIG.Url + 'api/invoices/save', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            ticket_id: ticketId,
            ticket_type_id: ticketTypeId,
            status: ticketStatus ? ticketStatus : 'ticket',
            client_id: invoiceData.client.id,
            products: invoiceData.products,
            service_agreement: invoiceData.service_agreements,
            inventory: invoiceData.inventory,
            timesheetAmount: invoiceData.timeSheet[0].total_amount,
            jobTime: invoiceData.timeSheet[0].job_time,
            travelTime: invoiceData.timeSheet[0].td_time,
            pauseTime: invoiceData.timeSheet[0].pause_time,
            total: productsTotal,
            paid: totalPay,
            payment_method: paymentType,
            balance: balance,
            cheque_no: checkNumber,
            ticketDate: date,
            ticket_locked: null,
            ticket_suspend: null,
            ticket_closed: null,
            ticket_draft: 'draft',
            signature: signature,
            notes: note,
            success: 'true',
          }),
        });

        // Parsing the response
        const data = await response.json();

        // Checking response status
        if (data.success) {
          return;
        }
      }
    } catch (error) {
      console.warn(error);
    }
  };

  // Use the global function to listen for beforeRemove event
  // useBackHandler(convertToDraft,loading);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView>
          {isActiveView == true && (
            <>
              {clientId ? (
                <LinearGradient
                  colors={theme.colors.header_linear_gradient}
                  style={styles.HeaderMainContainer}>
                  <View style={styles.RowItemContainerSpaceBetween}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {DatePickerComponent()}
                      <Text style={styles.ClientNameTittle}>
                        {invoiceData.client.fn} {invoiceData.client.ln}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() =>
                          setTimerModel(true) +
                          setTimer(true) +
                          setToggleMenu(false)
                        }
                        style={styles.SelectDateButton}>
                        <LinearGradient
                          colors={theme.colors.header_button_linear_gradient}
                          style={{
                            backgroundColor: theme.colors.primary,
                            alignItems: 'center',
                            borderRadius: 50,
                            paddingVertical: 3,
                            paddingHorizontal: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                fontSize: 13,
                                color: '#fff',
                                fontFamily: 'DMSans-Bold',
                              }}>
                              {selectedTimer}
                            </Text>
                            <Image
                              style={{height: 30, width: 30, tintColor: '#fff'}}
                              source={require('./assets/DropDown.png')}
                            />
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                      {selectedTimer == 'T&D Time' && (
                        <>
                          <Text style={styles.TimeSheetText}>
                            {tdHours.toString().padStart(2, '0')}:
                            {tdMinutes.toString().padStart(2, '0')}:
                            {tdSeconds.toString().padStart(2, '0')}
                          </Text>
                          <TouchableOpacity onPress={startTdTime}>
                            {isTdActive ? (
                              <Image
                                style={styles.timerImage}
                                source={require('./assets/pause.png')}
                              />
                            ) : (
                              <Image
                                style={styles.timerImage}
                                source={require('./assets/play.png')}
                              />
                            )}
                          </TouchableOpacity>
                        </>
                      )}
                      {selectedTimer == 'Job Time' && (
                        <>
                          <Text style={styles.TimeSheetText}>
                            {jobHours.toString().padStart(2, '0')}:
                            {jobMinutes.toString().padStart(2, '0')}:
                            {jobSeconds.toString().padStart(2, '0')}
                          </Text>
                          <TouchableOpacity onPress={startJobTime}>
                            {isJobActive ? (
                              <Image
                                style={styles.timerImage}
                                source={require('./assets/pause.png')}
                              />
                            ) : (
                              <Image
                                style={styles.timerImage}
                                source={require('./assets/play.png')}
                              />
                            )}
                          </TouchableOpacity>
                        </>
                      )}
                      {selectedTimer == 'Break Time' && (
                        <>
                          <Text style={styles.TimeSheetText}>
                            {breakHours.toString().padStart(2, '0')}:
                            {breakMinutes.toString().padStart(2, '0')}:
                            {breakSeconds.toString().padStart(2, '0')}
                          </Text>
                          <TouchableOpacity onPress={startPauseTime}>
                            {isBreakActive ? (
                              <Image
                                style={styles.timerImage}
                                source={require('./assets/pause.png')}
                              />
                            ) : (
                              <Image
                                style={styles.timerImage}
                                source={require('./assets/play.png')}
                              />
                            )}
                          </TouchableOpacity>
                        </>
                      )}

                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() =>
                          setTimerModel(true) +
                          setTimer(false) +
                          setToggleMenu(true)
                        }
                        style={{alignSelf: 'flex-start', marginHorizontal: 10}}>
                        <LinearGradient
                          colors={theme.colors.header_button_linear_gradient}
                          style={{
                            backgroundColor: theme.colors.primary,
                            alignItems: 'center',
                            borderRadius: 5,

                            paddingHorizontal: 5,
                          }}>
                          <Image
                            style={{height: 35, width: 40, tintColor: '#fff'}}
                            source={require('./assets/menu.png')}
                          />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              ) : (
                <></>
              )}
            </>
          )}
          {isActiveView == false && (
            <>
              <LinearGradient
                colors={theme.colors.header_linear_gradient}
                style={styles.HeaderMainContainer}>
                <TouchableOpacity
                  onPress={() => setClientModel(true) + setClient(true)}
                  style={styles.ClientSelectButton}>
                  <LinearGradient
                    colors={theme.colors.header_button_linear_gradient}
                    style={{
                      backgroundColor: theme.colors.primary,
                      alignItems: 'center',
                      borderRadius: 5,
                      paddingVertical: 8,
                    }}>
                    <Text style={styles.SelectClientText}>Select A Client</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </>
          )}

          <View style={styles.container}>
            <View style={styles.headerRow}>
              <Text
                style={[styles.headerCell, {flex: 1, paddingHorizontal: 2}]}>
                Qty
              </Text>
              <Text style={[styles.headerCell, {flex: 1.5}]}>Product Code</Text>
              <Text style={[styles.headerCell, {flex: 1.5}]}>Description</Text>
              <Text style={[styles.headerCell, {flex: 1}]}>Level</Text>
              <Text style={[styles.headerCell, {flex: 1}]}>Amount</Text>
              <Text
                style={[styles.headerCell, {flex: 0.7, paddingHorizontal: 0}]}>
                Action
              </Text>
            </View>

            {invoiceData.products.map((product_values, index) => (
              <TouchableOpacity
                onPress={() => editProductFunction(product_values)}
                activeOpacity={0.6}
                key={index}
                style={styles.bodyRow}>
                <Text
                  style={[styles.bodyCell, {flex: 1, paddingHorizontal: 2}]}>
                  {product_values.quantity}
                </Text>
                <Text style={[styles.bodyCell, {flex: 1.5}]}>
                  {product_values.code}
                </Text>
                <Text style={[styles.bodyCell, {flex: 1.5}]}>
                  {product_values.product_type == 'product'
                    ? product_values.name
                      ? product_values.name
                      : product_values.description
                    : product_values.description}
                </Text>

                <Text style={[styles.bodyCell, {flex: 1}]}>
                  {product_values.labour_hours}
                </Text>
                <Text style={[styles.bodyCell, {flex: 1}]}>
                  {product_values.total}
                </Text>
                <TouchableOpacity
                  TouchableOpacity
                  onPress={() => removeProduct(index)}
                  style={[styles.bodyCell, {flex: 0.7, paddingHorizontal: 0}]}>
                  <Image
                    style={{
                      alignSelf: 'center',
                      width: 30,
                      height: 30,
                      resizeMode: 'contain',
                      tintColor: 'red',
                    }}
                    source={require('./assets/Remove.png')}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {invoiceData.service_agreements.map((service_agreement, index) => (
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    STRING_CONSTANTS.default_alert_box_tittle,
                    STRING_CONSTANTS.edit_service_agreement_alert_box,
                    [{text: 'OK', onPress: () => ''}],
                  )
                }
                activeOpacity={0.6}
                key={index}
                style={styles.bodyRow}>
                <Text
                  style={[styles.bodyCell, {flex: 1, paddingHorizontal: 2}]}>
                  {service_agreement.serviceQuantity}
                </Text>
                <Text style={[styles.bodyCell, {flex: 1.5}]}>
                  {service_agreement.name}
                </Text>
                <Text style={[styles.bodyCell, {flex: 1.5}]}>
                  {service_agreement.description
                    ? service_agreement.description
                    : 'Service Agreement'}
                </Text>
                <Text style={[styles.bodyCell, {flex: 1}]}>0</Text>
                <Text style={[styles.bodyCell, {flex: 1}]}>
                  {service_agreement.serviceAmount}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    removeServiceAgreement(service_agreement, index)
                  }
                  style={[styles.bodyCell, {flex: 0.7, paddingHorizontal: 0}]}>
                  <Image
                    style={{
                      alignSelf: 'center',
                      width: 30,
                      height: 30,
                      resizeMode: 'contain',
                      tintColor: 'red',
                    }}
                    source={require('./assets/Remove.png')}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            {invoiceData.inventory.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  setInventoryState(prevState => ({
                    ...prevState,
                    selectedItem: item,
                    editInventory: true,
                  }))
                }
                activeOpacity={0.6}
                key={index}
                style={styles.bodyRow}>
                <Text
                  style={[styles.bodyCell, {flex: 1, paddingHorizontal: 2}]}>
                  {item.inventoryQuantity}
                </Text>
                <Text style={[styles.bodyCell, {flex: 1.5}]}>{item.title}</Text>
                <Text style={[styles.bodyCell, {flex: 1.5}]}>Inventory</Text>
                <Text style={[styles.bodyCell, {flex: 1}]}>0</Text>
                <Text style={[styles.bodyCell, {flex: 1}]}>
                  {item.inventoryAmount}
                </Text>
                <TouchableOpacity
                  onPress={() => removeInventory(item, index)}
                  style={[styles.bodyCell, {flex: 0.7, paddingHorizontal: 0}]}>
                  <Image
                    style={{
                      alignSelf: 'center',
                      width: 30,
                      height: 30,
                      resizeMode: 'contain',
                      tintColor: 'red',
                    }}
                    source={require('./assets/Remove.png')}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            {timeSheetView == true && (
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    STRING_CONSTANTS.default_alert_box_tittle,
                    STRING_CONSTANTS.edit_timer_alert_box,
                    [{text: 'OK', onPress: () => ''}],
                  )
                }
                activeOpacity={0.6}
                style={styles.bodyRow}>
                <Text
                  style={[styles.bodyCell, {flex: 1, paddingHorizontal: 2}]}>
                  1
                </Text>
                <Text style={[styles.bodyCell, {flex: 1.5}]}>
                  {STRING_CONSTANTS.td_time_title}
                </Text>
                <Text style={[styles.bodyCell, {flex: 1.5}]}>
                  Travel And Diagnostic Time
                </Text>
                <Text style={[styles.bodyCell, {flex: 1}]}>0</Text>
                <Text style={[styles.bodyCell, {flex: 1}]}>83.52</Text>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      STRING_CONSTANTS.default_alert_box_tittle,
                      STRING_CONSTANTS.delete_timer_alert_box,
                      [{text: 'OK', onPress: () => ''}],
                    )
                  }
                  style={[styles.bodyCell, {flex: 0.7, paddingHorizontal: 0}]}>
                  <Image
                    style={{
                      alignSelf: 'center',
                      width: 30,
                      height: 30,
                      resizeMode: 'contain',
                      tintColor: 'red',
                    }}
                    source={require('./assets/Remove.png')}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            {isActiveView == true && (
              <TouchableOpacity
                onPress={() => OnOpenProductModel()}
                style={styles.bodyRow}>
                <View
                  style={[
                    styles.headerCell,
                    {
                      flex: 1,
                      paddingHorizontal: 2,
                      borderBottomWidth: 0.5,
                      borderTopWidth: 0.5,
                      borderLeftWidth: 0.5,
                      borderRightWidth: 0.5,
                    },
                  ]}>
                  <Image
                    style={{
                      height: 32,
                      width: 32,
                      alignSelf: 'center',
                      tintColor: theme.colors.primary,
                    }}
                    source={require('./assets/add.png')}
                  />
                </View>
                <View
                  style={[
                    styles.headerCell,
                    {
                      flex: 1.5,
                      borderBottomWidth: 0.5,
                      borderTopWidth: 0.5,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                    },
                  ]}></View>
                <View
                  style={[
                    styles.headerCell,
                    {
                      flex: 1.5,
                      borderBottomWidth: 0.5,
                      borderTopWidth: 0.5,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                    },
                  ]}></View>
                <View
                  style={[
                    styles.headerCell,
                    {
                      flex: 1,
                      borderBottomWidth: 0.5,
                      borderTopWidth: 0.5,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                    },
                  ]}></View>
                <View
                  style={[
                    styles.headerCell,
                    {
                      flex: 1,
                      borderBottomWidth: 0.5,
                      borderTopWidth: 0.5,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                    },
                  ]}></View>
                <View
                  style={[
                    styles.headerCell,
                    {
                      flex: 0.7,
                      paddingHorizontal: 0,
                      borderBottomWidth: 0.5,
                      borderTopWidth: 0.5,
                      borderLeftWidth: 0,
                      borderRightWidth: 0.5,
                    },
                  ]}></View>
              </TouchableOpacity>
            )}
          </View>

          {SubmitAmountComponent()}
        </ScrollView>

        {/*  Modal popup toggleBar and Timer */}

        <Modal animationType="fade" transparent={true} visible={timerModel}>
          <TouchableWithoutFeedback onPress={() => setTimerModel(false)}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1}}>
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: '30%',
                    width: '80%',
                    backgroundColor: '#fff',
                    borderColor: '#999999',
                    borderWidth: 5,
                  }}>
                  {timer == true && <>{selectTimeComponent()}</>}
                  {toggleMenu == true && <>{ToggleBarMenu()}</>}
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>

        {/*  Modal popup Client And Ticket*/}
        <Modal animationType="fade" transparent={true} visible={clientModel}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1}}>
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: '80%',
                  width: '80%',
                  backgroundColor: '#fff',
                  borderColor: '#999999',
                  borderWidth: 5,
                }}>
                {client == true && <>{clientViewComponent()}</>}
                {ticket == true && <>{ticketTypeComponent()}</>}
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        {/* products Modal popup */}

        <Modal animationType="fade" transparent={true} visible={productsModal}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1}}>
              <View style={styles.ModelMainContainer}>
                {defaultForm == true && <>{DefaultFormComponent()}</>}
                {catalog == true && <>{CatalogComponent()}</>}
                {category == true && <>{CategoryComponent()}</>}
                {product == true && <>{ProductComponent()}</>}
                {customProduct == true && <>{CustomProductComponent()}</>}
                {addEmployee == true && <>{addEmployeeComponent()}</>}
                {employee == true && <>{selectEmployeeComponent()}</>}
                {servicesAgreement == true && (
                  <>{ServicesAgreementComponent()}</>
                )}
                {inventory == true && <>{inventoryComponent()}</>}
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
          {popupLabor == true && (
            <View
              style={{
                borderRadius: 5,
                position: 'absolute',
                height: 200,
                width: 400,
                backgroundColor: '#FFFFFF',
                borderColor: '#B2B9BF',
                right: 100,
                top: 300,
                borderWidth: 1,
                borderColor: '#B2B9BF',
              }}>
              <ScrollView>
                <TouchableOpacity
                  onPress={() => saveAddProduct() + setPopupLabor(false)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderColor: '#B2B9BF',
                  }}>
                  <View
                    style={{
                      width: '80%',
                      height: '100%',
                      backgroundColor: '#f9fbee',
                      paddingHorizontal: 30,
                    }}>
                    <Text
                      style={{
                        color: 'black',

                        fontFamily: 'DMSans-Bold',
                        fontSize: 15,
                        padding: 20,
                      }}>
                      Product + Labor
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '20%',
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        resizeMode: 'contain',
                        tintColor: '#cccccc',
                      }}
                      source={require('./assets/check.png')}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => saveAddProduct() + setPopupLabor(false)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderColor: '#B2B9BF',
                  }}>
                  <View
                    style={{
                      width: '80%',
                      height: '100%',
                      backgroundColor: '#f9fbee',
                      paddingHorizontal: 30,
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'DMSans-Bold',
                        fontSize: 15,
                        padding: 20,
                      }}>
                      Product Only
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '20%',
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        resizeMode: 'contain',
                        tintColor: '#cccccc',
                      }}
                      source={require('./assets/check.png')}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => saveAddProduct() + setPopupLabor(false)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderColor: '#B2B9BF',
                  }}>
                  <View
                    style={{
                      width: '80%',
                      height: '100%',
                      backgroundColor: '#f9fbee',
                      paddingHorizontal: 30,
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'DMSans-Bold',
                        fontSize: 15,
                        padding: 20,
                      }}>
                      Labor Only
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '20%',
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        resizeMode: 'contain',
                        tintColor: '#cccccc',
                      }}
                      source={require('./assets/check.png')}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => saveAddProduct() + setPopupLabor(false)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderColor: '#B2B9BF',
                  }}>
                  <View
                    style={{
                      width: '80%',
                      height: '100%',
                      backgroundColor: '#f9fbee',
                      paddingHorizontal: 30,
                    }}>
                    <Text
                      style={{
                        color: 'black',

                        fontFamily: 'DMSans-Bold',
                        fontSize: 15,
                        padding: 20,
                      }}>
                      No Charge
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '20%',
                      height: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        resizeMode: 'contain',
                        tintColor: '#cccccc',
                      }}
                      source={require('./assets/check.png')}
                    />
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        </Modal>

        {/*  Modal popup Submit*/}
        <Modal
          animationType="fade"
          transparent={true}
          visible={submitAmountModel}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{flex: 1}}>
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    height: 250,
                    width: '80%',
                    backgroundColor: '#fff',
                    borderColor: '#999999',
                    borderWidth: 5,
                  }}>
                  {payment_Type == true && <>{paymentTypeComponent()}</>}
                  {payAmount == true && <>{payPaymentComponent()}</>}
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </Modal>

        <Modal
          visible={signaturePad}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setSignaturePad(false)}>
          <View
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              flex: 1,
              justifyContent: 'center',
            }}>
            {SignatureCaptureComponent()}
          </View>
        </Modal>

        <View style={{flex: 1}}>
          <Modal animationType="fade" transparent={true} visible={loading}>
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          </Modal>
        </View>

        <QuantityAdjusterModal
          visible={inventoryState.editInventory}
          initialQuantity={
            inventoryState.selectedItem?.inventoryQuantity
              ? inventoryState.selectedItem.inventoryQuantity
              : 1
          }
          message="Inventory Quantity"
          onClose={() =>
            setInventoryState(prevState => ({
              ...prevState,
              editInventory: false,
            }))
          }
          onChange={inventoryQuantityUpdate}
          onSave={handleUpdateInventory}
        />

        {/* BOTTOM TAB BAR */}
        <BottomTabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          saveDraftButton={convertToDraft}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Ticket;

const styles = StyleSheet.create({
  TittleClientList: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
  },
  DateMainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  Date: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
  },
  TotalAmountInput: {
    backgroundColor: '#e0e2e1',
    paddingHorizontal: 20,
    paddingVertical: 20,
    padding: 10,
    fontSize: 15,
    fontFamily: 'DMSans-Medium',
    color: '#000000',
    width: '50%',
    height: '100%',
    borderBottomWidth: 0.3,
    borderColor: '#999999',
  },
  // Bottom Sheet Styling
  MainContainerClientList: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  SearchBar: {
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EAEAEA',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    color: '#444444',
    padding: 10,
    paddingHorizontal: 20,
  },
  ErrorMessage: {
    marginVertical: 10,
    color: 'red',
    textAlign: 'center',
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
  },
  BottomTabBarMainContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 30,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#cccccc',
  },
  BottomTabBarButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  BottomTabBarImageIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: theme.colors.primary,
  },
  BottomTabBarImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  BottomTabBarText: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
  },
  ///new Timers stylings
  timerImage: {
    height: 35,
    width: 35,
    resizeMode: 'contain',
    tintColor: 'black',
  },
  //new popup
  MainContainerProductsData: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  CatalogNameText: {
    color: '#000000',
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    marginLeft: 15,
    marginTop: 5,
    textTransform: 'capitalize',
  },
  BoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    padding: 20,
    borderColor: '#B2B9BF',
    borderBottomWidth: 1,
  },
  Icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: 'black',
  },
  productModelContainer: {
    backgroundColor: 'white',
    height: '70%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#B2B9BF',
  },
  PopUpCancelButton: {
    fontSize: 15,
    paddingVertical: 5,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'DMSans-Bold',
    width: 100,
    backgroundColor: '#2c2c2c',
    borderRadius: 5,
  },
  ManufacturerName: {
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'DMSans-Bold',
    textTransform: 'capitalize',
    paddingVertical: 5,
    backgroundColor: '#808080',
  },
  // ServiceAgreement modal styling
  ServiceAgreementDataContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B2B9BF',
  },
  ServiceAgreementAddIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#fff',
    paddingHorizontal: 5,
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  ServiceAgreementProductNameText: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    padding: 2,
  },
  ServiceAgreementDesText: {
    color: '#4B4B4B',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    padding: 2,
  },
  ServiceAgreementPriceText: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    padding: 2,
  },
  ProductErrorMessage: {
    marginVertical: 10,
    color: 'red',
    textAlign: 'center',
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
  },
  ModelMainContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customProductMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#B2B9BF',
  },
  customProductInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#B2B9BF',
  },
  InputLabels: {
    color: '#000000',
    fontFamily: 'DMSans-Medium',
    fontSize: 17,
  },
  customProductInput: {
    color: 'black',
    fontSize: 17,
    fontFamily: 'DMSans-Medium',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '50%',
    backgroundColor: '#f9fbee',
    borderWidth: 0.5,
    borderColor: '#B2B9BF',
    borderRadius: 5,
  },
  HeaderMainContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#83b627',
  },
  ClientSelectButton: {
    width: '20%',
    alignSelf: 'flex-end',
  },
  SelectClientText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
  },
  RowItemContainerSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  SelectDateButton: {
    alignSelf: 'flex-start',
  },
  ClientNameTittle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    marginHorizontal: 50,
  },
  TimeSheetText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'DMSans-Bold',
    marginHorizontal: 10,
  },
  SubmitMainContainer: {
    flex: 1,
    flexDirection: 'row', // Assuming you want a row layout
    justifyContent: 'space-between', // Adjust as needed
    alignItems: 'center', // Adjust as needed
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  PaidAmountMainContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
  },
  PaidAmountSubContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  PaidAmountHeadingText: {
    color: '#000',
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
  },

  PaidAmountValueText: {
    color: '#000',
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
  },
  PaidAmountSignText: {
    color: '#ef0000',
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
  },
  SignatureButton: {
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  SelectTimerDropDown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderWidth: 0.5,
    borderColor: 'gray',
  },
  SelectTimerDropDownText: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'DMSans-Bold',
  },
  TimeSheetText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'DMSans-Bold',
    marginHorizontal: 10,
  },
  ClientMainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderColor: 'gray',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  RowItemContainerCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  RowItemContainerSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ClientDataName: {
    color: '#333333',
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    margin: 2,
  },
  ClientDataDetail: {
    color: '#808080',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    margin: 2,
  },
  SelectTicketTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
  },
  SelectTicketTypeText: {
    color: '#000000',
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
  },
  PaymentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
  },
  container: {flex: 1, padding: 16, paddingTop: 30},
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#4d4d4d',
    borderWidth: 0.5,
    borderColor: '#4d4d4d',
  },
  headerCell: {
    padding: 10,
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: '#C1C0B9',
    color: '#fff',
    fontFamily: 'DMSans-Bold',
  },
  bodyRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#cccccc',
  },
  bodyCell: {
    padding: 10,
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: '#C1C0B9',
    fontFamily: 'DMSans-Medium',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
  },
  outOfStock: {
    backgroundColor: '#d72929',
  },
  lowStock: {
    backgroundColor: '#ffd600',
  },
  inStock: {
    backgroundColor: '#fff',
    borderColor: '#B2B9BF',
    borderWidth: 0.3,
  },
});
