import React, {useState, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  BackHandler,
  RefreshControl,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import NAVIGATION_STRING_CONSTANTS from '../../navigation/NavigarionStringConstants';
import BottomTabBar from '../../Components/BottomTabBar';
import theme from '../../utils/theme';
import SwitchSelector from '../../Components/SwitchSelector';
import TicketItem from './components/TicketItem';
import TicketOptionsSheet from './components/TicketOptionsSheet';
import {useAllTickets} from '../../hooks/useAllTickets';
import {useOrientation} from '../../utils/orientation';
import styles from './styles';

const DetailsScreen = () => {
  const navigation = useNavigation();
  const selectSheet = useRef(null);
  const windowWidth = Dimensions.get('window').width;
  const orientation = useOrientation();
  const [activeTab, setActiveTab] = useState(4);
  const [selectTab, setSelectTab] = useState(0);
  const [parameters, setParameters] = useState({});
  const {
    dataSource,
    loading,
    refreshing,
    status,
    getInitialData,
    loadMoreData,
    setRefreshing,
    setStatus,
  } = useAllTickets(navigation);

  useFocusEffect(
    useCallback(() => {
      setSelectTab(0);
      getInitialData();
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.navigate('Root', {
            screen: NAVIGATION_STRING_CONSTANTS.home_screen,
          });
          return true;
        },
      );
      return () => backHandler.remove();
    }, [navigation]),
  );

  const setTicketParameters = item => {
    const baseParams = {
      ClientId: item.client_id,
      TicketId: item.id,
      ClientFName: item.first_name,
      ClientLName: item.last_name,
      ClientEmail: item.email,
      ClientMobile: item.phone_no_1,
    };

    setParameters({
      convert: {
        ...baseParams,
        TicketDescription: item.ticket_type_description,
        TicketTypeId: item.ticket_type_id,
        Status: item.status,
      },
      edit: {
        ...baseParams,
        _Id: item.id,
        Client_Id: item.client_id,
        Client_FName: item.first_name,
        Client_LName: item.last_name,
        Ticket_TypeId: item.ticket_type_id,
        Ticket_Date: item.date,
        Ticket_TypeName: item.ticket_type_description,
        TicketNotes: item.ticket_notes,
      },
      detail: baseParams,
    });
    selectSheet.current.open();
  };

  const navigationHandlers = {
    convertToInvoice: () => {
      navigation.navigate(
        NAVIGATION_STRING_CONSTANTS.ticket_screen,
        parameters.convert,
      );
      selectSheet.current.close();
    },
    editTicket: () => {
      navigation.navigate(
        NAVIGATION_STRING_CONSTANTS.edit_ticket_screen,
        parameters.edit,
      );
      selectSheet.current.close();
    },
    ticketDetail: () => {
      navigation.navigate(
        NAVIGATION_STRING_CONSTANTS.download_screen,
        parameters.detail,
      );
      selectSheet.current.close();
    },
  };

  const handleTabChange = (value, tabId) => {
    getInitialData(value);
    setSelectTab(tabId);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    const statusMap = ['schedule', 'closed', '', 'decline', 'suspend'];
    getInitialData(statusMap[selectTab]);
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {!refreshing && loading && (
        <ActivityIndicator
          color={theme.colors.primary}
          size={'large'}
          style={styles.activityIndicator}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <SwitchSelector
        selectTab={selectTab}
        onTabChange={handleTabChange}
        windowWidth={windowWidth}
      />
      <FlatList
        data={dataSource}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TicketItem item={item} onPress={setTicketParameters} />
        )}
        ListFooterComponent={renderFooter}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            tintColor={'#8bc34a'}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() =>
          navigation.navigate(NAVIGATION_STRING_CONSTANTS.create_ticket_screen)
        }>
        <Image
          style={styles.imageFloatingButton}
          source={require('../../assets/FloatingButton.png')}
        />
      </TouchableOpacity>
      <RBSheet
        ref={selectSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={250}
        customStyles={styles.rbsheet}>
        <TicketOptionsSheet
          parameter={parameters.convert}
          convertToInvoice={navigationHandlers.convertToInvoice}
          EditTicket={navigationHandlers.editTicket}
          TicketDetail={navigationHandlers.ticketDetail}
        />
      </RBSheet>
      <BottomTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

export default DetailsScreen;
