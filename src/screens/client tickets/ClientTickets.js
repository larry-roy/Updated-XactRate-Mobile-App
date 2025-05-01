import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabBar from '../../Components/BottomTabBar';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import STRING_CONSTANTS from '../../strings/strings';
import URL_CONFIG from '../../Components/global-config';
import {Dimensions} from 'react-native';
import NAVIGATION_STRING_CONSTANTS from '../../navigation/NavigarionStringConstants';
import SwitchSelector from '../../Components/SwitchSelector';
import FooterLoader from '../../Components/FooterLoader';
import TicketItem from './components/TicketItem';
import TicketOptionsSheet from './components/TicketOptionsSheet';
import {useOrientation} from '../../utils/orientation';
const ClientTickets = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const orientation = useOrientation();
  const windowWidth = Dimensions.get('window').width;
  const SelectSheet = useRef(null);

  // Passing parameters variable
  const {ClientId, ClientFName, ClientLName, ClientEmail, ClientMobile} =
    route.params;
  const [selectTab, setSelectTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [isListEnd, setIsListEnd] = useState(false);
  const [status, setStatus] = useState(0);

  const [parameter, setParameter] = useState();
  const [parameterEditTicket, setParameterEditTicket] = useState();
  const [parameterTicketDetail, setParameterTicketDetail] = useState();

  /**
   * Triggers when user navigation screen is focused
   */

  useEffect(() => {
    setIsListEnd(false);
    setOffset(1);
    setSelectTab(0);
    setStatus('schedule');
    getDataOnScreen((value = 'schedule'));
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

  useFocusEffect(
    useCallback(() => {
      setIsListEnd(false);
      setOffset(1);
      setSelectTab(0);
      setStatus('schedule');
      getDataOnScreen((value = 'schedule'));
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
   * Set param in variable
   */

  function Param(item) {
    setParameter({
      ClientId: ClientId,
      TicketId: item.id,
      ClientFName: ClientFName,
      ClientLName: ClientLName,
      ClientEmail: ClientEmail,
      ClientMobile: ClientMobile,
      TicketDescription: item.ticket_type_description,
      TicketTypeId: item.ticket_type_id,
      Status: item.status,
    });
    setParameterEditTicket({
      _Id: item.id,
      Client_Id: ClientId,
      Ticket_TypeId: item.ticket_type_id,
      Ticket_Date: item.date,
      Client_FName: ClientFName,
      Client_LName: ClientLName,
      Ticket_TypeName: item.ticket_type_description,
      ClientEmail: ClientEmail,
      Status: item.status,
    });
    setParameterTicketDetail({
      ClientId: ClientId,
      TicketId: item.id,
      ClientFName: ClientFName,
      ClientLName: ClientLName,
      ClientEmail: ClientEmail,
      ClientMobile: ClientMobile,
    });
    SelectSheet.current.open();
  }

  /**
   * Set param convertToInvoice
   */

  function convertToInvoice() {
    navigation.navigate(NAVIGATION_STRING_CONSTANTS.ticket_screen, {
      ClientId: parameter.ClientId,
      TicketId: parameter.TicketId,
      ClientFName: parameter.ClientFName,
      ClientLName: parameter.ClientLName,
      ClientEmail: parameter.ClientEmail,
      ClientMobile: parameter.ClientMobile,
      TicketDescription: parameter.TicketDescription,
      TicketTypeId: parameter.TicketTypeId,
      Status: parameter.Status,
    });
    SelectSheet.current.close();
  }

  /**
   * Set param convertToInvoice
   */
  function EditTicket() {
    navigation.navigate(NAVIGATION_STRING_CONSTANTS.edit_ticket_screen, {
      _Id: parameterEditTicket._Id,
      Client_Id: parameterEditTicket.Client_Id,
      Ticket_TypeId: parameterEditTicket.Ticket_TypeId,
      Ticket_Date: parameterEditTicket.Ticket_Date,
      Client_FName: parameterEditTicket.Client_FName,
      Client_LName: parameterEditTicket.Client_LName,
      Ticket_TypeName: parameterEditTicket.Ticket_TypeName,
      ClientEmail: parameterEditTicket.ClientEmail,
      ClientMobile: parameterEditTicket.ClientMobile,
    });
    SelectSheet.current.close();
  }

  /**
   * Set param convertToInvoice
   */
  function TicketDetail() {
    navigation.navigate(NAVIGATION_STRING_CONSTANTS.download_screen, {
      ClientId: parameterTicketDetail.ClientId,
      TicketId: parameterTicketDetail.TicketId,
      ClientFName: parameterTicketDetail.ClientFName,
      ClientLName: parameterTicketDetail.ClientLName,
      ClientEmail: parameterTicketDetail.ClientEmail,
      ClientMobile: parameterTicketDetail.ClientMobile,
    });
    SelectSheet.current.close();
  }

  /**
   * when user on focus screen fetch ticket data
   */

  async function getDataOnScreen(value) {
    setDataSource();
    setOffset(1);
    setStatus(value);
    setIsListEnd(false);
    var userToken = await AsyncStorage.getItem('userToken');
    var options = {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    };
    setLoading(true);
    fetch(
      URL_CONFIG.Url + `api/clients/${ClientId}/tickets?status=${value}&page=0`,
      options,
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success == true) {
          setOffset(offset + 1);
          setDataSource(responseJson.tickets.data);
          setLoading(false);
        } else if (responseJson.success == false) {
          setLoading(false);
          if (responseJson.status_code == 401) {
            AsyncStorage.clear();
            Alert.alert(responseJson.message);
            navigation.navigate(NAVIGATION_STRING_CONSTANTS.login_screen);
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  /**
   * when user on screen load more data
   */

  async function getData() {
    if (!loading && !isListEnd) {
      var userToken = await AsyncStorage.getItem('userToken');
      var options = {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      };
      setLoading(true);
      fetch(
        URL_CONFIG.Url +
          `api/clients/${ClientId}/tickets?status=${status}&page=` +
          offset,
        options,
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.tickets.data.length > 0) {
            setOffset(offset + 1);
            setDataSource([...dataSource, ...responseJson.tickets.data]);
            setLoading(false);
          } else {
            setIsListEnd(true);
            setLoading(false);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }

  const handleTabChange = (value, tabId) => {
    getDataOnScreen(value);
    setSelectTab(tabId);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <View style={styles.ClientBoxContainer}>
        <Text style={styles.ClientBoxNameText}>
          {ClientFName} {ClientLName}
        </Text>
        <View style={styles.ClientBoxDetailContainer}>
          <Image
            style={styles.ImageIcon}
            source={require('../../assets/Email.png')}
          />
          <Text style={styles.ClientDataDetailText}>{ClientEmail}</Text>
        </View>
        <View style={styles.ClientBoxDetailContainer}>
          <Image
            style={styles.ImageIcon}
            source={require('../../assets/Call.png')}
          />
          <Text style={styles.ClientDataDetailText}>+{ClientMobile}</Text>
        </View>
      </View>
      <Text style={styles.Tittle}>Tickets</Text>
      <SwitchSelector
        selectTab={selectTab}
        onTabChange={handleTabChange}
        windowWidth={windowWidth}
      />

      {dataSource ? (
        dataSource.length > 0 ? (
          <FlatList
            data={dataSource}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TicketItem item={item} onPress={item => Param(item)} />
            )}
            ListFooterComponent={loading ? <FooterLoader /> : null}
            onEndReached={getData}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <View style={{flex: 1, paddingVertical: 20}}>
            <Text
              style={{
                color: '#000000',
                fontFamily: 'DMSans-Medium',
                fontSize: 15,
                textAlign: 'center',
                margin: 10,
                backgroundColor: '#eeeeee',
                padding: 18,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,

                elevation: 4,
                borderWidth: 0.3,
                borderColor: 'gray',
              }}>
              {STRING_CONSTANTS.no_ticket}
            </Text>
          </View>
        )
      ) : (
        <View style={styles.MainContainer}>
          <ActivityIndicator size={30} color="#000000" />
        </View>
      )}
      <RBSheet
        ref={SelectSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={250}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
        }}>
        <TicketOptionsSheet
          parameter={parameter}
          convertToInvoice={convertToInvoice}
          EditTicket={EditTicket}
          TicketDetail={TicketDetail}
        />
      </RBSheet>
      {/* BOTTOM TAB BAR */}
      <BottomTabBar />
    </SafeAreaView>
  );
};

export default ClientTickets;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    padding: 10,
  },
  ClientBoxContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: '#cccccc',
    paddingVertical: 5,
  },
  ClientBoxNameText: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 30,
    padding: 8,
    paddingLeft: 30,
  },
  ClientDataDetailText: {
    color: '#4B4B4B',
    fontFamily: 'DMSans-Medium',
    fontSize: 18,
    padding: 8,
    flex: 1,
  },
  ImageIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: 'black',
  },
  ClientBoxDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
  },
  Tittle: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
