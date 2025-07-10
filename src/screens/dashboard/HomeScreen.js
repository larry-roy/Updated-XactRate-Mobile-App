// screens/Home.js
import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  BackHandler,
  Platform,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import RNExitApp from 'react-native-exit-app';
import NAVIGATION_STRING_CONSTANTS from '../../navigation/NavigarionStringConstants';
import BottomTabBar from '../../Components/BottomTabBar';
import STRING_CONSTANTS from '../../strings/strings';
import DashboardBox from '../../Components/DashboardBox';
import ClientList from './components/ClientList';
import TicketList from './components/TicketList';
import {useOrientation} from '../../utils/orientation';
import {useDashboard} from '../../hooks/useDashboard';
import styles from './styles';
import BannerComponent from './components/BannerComponent';

const Home = () => {
  const navigation = useNavigation();
  const orientation = useOrientation();
  const [activeTab, setActiveTab] = useState(0);
  const {userData, clients, tickets, loadDashboardData} =
    useDashboard(navigation);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (Platform.OS === 'ios') {
            RNExitApp.exitApp();
          } else {
            BackHandler.exitApp();
          }
          return true;
        },
      );
      return () => backHandler.remove();
    }, [loadDashboardData]),
  );

  const handleTicketPress = ticket => {
    navigation.navigate(NAVIGATION_STRING_CONSTANTS.ticket_screen, {
      ClientId: ticket.client_id,
      TicketId: ticket.id,
      ClientFName: ticket.first_name,
      ClientLName: ticket.last_name,
      ClientEmail: ticket.email,
      ClientMobile: ticket.phone_no_1,
      TicketDescription: ticket.ticket_type_description,
      TicketTypeId: ticket.ticket_type_id,
      Status: ticket.status,
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.MainContainer}>
          <Image
            style={styles.XrLogo}
            source={require('../../assets/logo_png.png')}
          />
          <Text style={styles.UserNameTittle}>
            {STRING_CONSTANTS.user_name_tittle} {userData?.full_name}
          </Text>
          <View style={styles.dashboardContainer}>
            <DashboardBox />
          </View>
          <BannerComponent navigation={navigation} />
        </View>
        <ClientList clients={clients} navigation={navigation} />
        <TicketList
          tickets={tickets}
          navigation={navigation}
          onTicketPress={handleTicketPress}
        />
      </ScrollView>
      <BottomTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};
export default Home;
