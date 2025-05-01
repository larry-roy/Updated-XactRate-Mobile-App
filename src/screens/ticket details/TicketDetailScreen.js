import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import {BackHandler} from 'react-native';
import BottomTabBar from '../../Components/BottomTabBar';
import ClientInfo from './components/ClientInfo';
import InvoiceDetails from './components/InvoiceDetails';
import {useOrientation} from '../../utils/orientation';
import {usePDFDownloader} from '../../utils/PDFDownloader';
import {useInvoiceDetails} from '../../hooks/useInvoiceDetails';

const DownloadScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const orientation = useOrientation();
  const {
    ClientId,
    ClientFName,
    ClientLName,
    ClientEmail,
    ClientMobile,
    TicketId,
  } = route.params ?? {};

  const {
    tickets,
    products,
    serviceAgreements,
    inventory,
    customProducts,
    timeSheet,
    invoices,
    loadInvoiceData,
  } = useInvoiceDetails(TicketId, navigation);
  const {downloadPdfAlert} = usePDFDownloader(TicketId);
  useFocusEffect(
    useCallback(() => {
      loadInvoiceData();
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.goBack();
          return true;
        },
      );
      return () => backHandler.remove();
    }, [navigation, loadInvoiceData]),
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{backgroundColor: '#F5F5F5'}}>
        <ClientInfo
          firstName={ClientFName}
          lastName={ClientLName}
          email={ClientEmail}
          mobile={ClientMobile}
        />
        <Text style={styles.TittleScreen}>Ticket Details</Text>
        {invoices.length === 0 && !products.length ? (
          <ActivityIndicator size={30} color="#000000" />
        ) : (
          <InvoiceDetails
            invoices={invoices}
            products={products}
            serviceAgreements={serviceAgreements}
            inventory={inventory}
            customProducts={customProducts}
            timeSheet={timeSheet}
            onDownloadPress={downloadPdfAlert}
          />
        )}
      </ScrollView>
      <BottomTabBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  TittleScreen: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
    padding: 20,
    textAlign: 'center',
  },
});

export default DownloadScreen;
