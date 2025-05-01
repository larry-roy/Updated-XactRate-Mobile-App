import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import URL_CONFIG from './global-config';
import {Dimensions} from 'react-native';
import NAVIGATION_STRING_CONSTANTS from '../navigation/NavigarionStringConstants';
import theme from '../utils/theme';
import {useOrientation} from '../utils/orientation';

const BottomTabBar = ({activeTab, setActiveTab, saveDraftButton}) => {
  const navigation = useNavigation();
  const orientation = useOrientation();
  const [loading, setLoading] = useState(false);
  const windowWidth = Dimensions.get('window').width;

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const logout = async () => {
    setLoading(true);
    var userToken = await AsyncStorage.getItem('userToken');

    try {
      const response = await fetch(URL_CONFIG.Url + 'api/logout', {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then(response => response.json())
        .then(responseJson => {
          const newData = responseJson;
          if (newData.success == 'true') {
            AsyncStorage.clear();
            navigation.navigate(NAVIGATION_STRING_CONSTANTS.login_screen);
          } else {
            console.log(newData);
          }
        });
    } catch (error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {name: 'Dashboard', icon: require('../assets/dashboard.png')},
    {name: 'Schedule', icon: require('../assets/tabbar1.png')},
    {name: 'Clients', icon: require('../assets/tabbar2.png')},
    {name: 'Ticket', icon: require('../assets/invoice.png')},
    {name: 'All Tickets', icon: require('../assets/tabbar3.png')},
    {name: 'Logout', icon: require('../assets/tabbar4.png')},
  ];

  const handleTabPress = index => {
    if (index === 0) {
      navigation.navigate('Root', {
        screen: NAVIGATION_STRING_CONSTANTS.home_screen,
      });
      saveDraftButton && saveDraftButton();
    } else if (index === 1) {
      navigation.navigate('Root', {
        screen: NAVIGATION_STRING_CONSTANTS.schedule_screen,
      });
      saveDraftButton && saveDraftButton();
    } else if (index === 2) {
      navigation.navigate('Root', {
        screen: NAVIGATION_STRING_CONSTANTS.clients_screen,
      });
      saveDraftButton && saveDraftButton();
    } else if (index === 3) {
      navigation.navigate(NAVIGATION_STRING_CONSTANTS.ticket_screen);
      saveDraftButton && saveDraftButton();
    } else if (index === 4) {
      navigation.navigate('Root', {
        screen: NAVIGATION_STRING_CONSTANTS.details_screen,
      });
      saveDraftButton && saveDraftButton();
    } else if (index === 5) {
      saveDraftButton && saveDraftButton();
      logout();
    } else if (index === 6) {
      saveDraftButton && saveDraftButton();
      setActiveTab(index);
    }
  };

  const tabs1 = [
    {name: 'Dashboard', icon: require('../assets/dashboard.png')},
    null, // Index 1
    {name: 'Clients', icon: require('../assets/tabbar2.png')},
    null, // Index 3
    {name: 'All Tickets', icon: require('../assets/tabbar3.png')},
    {name: 'Logout', icon: require('../assets/tabbar4.png')},
  ];

  const handleTabPress1 = index => {
    if (index === 0) {
      navigation.navigate('Root', {
        screen: NAVIGATION_STRING_CONSTANTS.home_screen,
      });
      // Call saveDraftButton only if it's defined
      saveDraftButton && saveDraftButton();
    } else if (index === 2) {
      navigation.navigate('Root', {
        screen: NAVIGATION_STRING_CONSTANTS.clients_screen,
      });
      saveDraftButton && saveDraftButton();
    } else if (index === 4) {
      navigation.navigate('Root', {
        screen: NAVIGATION_STRING_CONSTANTS.details_screen,
      });
      saveDraftButton && saveDraftButton();
    } else if (index === 5) {
      logout();
    } else if (index === 6) {
      setActiveTab(index);
    }
  };

  function BottomSheetView() {
    if (windowWidth > 700 && !isKeyboardVisible) {
      return (
        <View style={styles.BottomTabBarMainContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab]}
              onPress={() => handleTabPress(index)}>
              <Image
                source={tab.icon}
                style={[
                  styles.tabIcon,
                  index === activeTab ? styles.activeTabIcon : null,
                ]}
              />
              <Text
                style={[
                  styles.tabText,
                  index === activeTab ? styles.activeTabText : null,
                ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } else if (!isKeyboardVisible) {
      return (
        <View style={styles.BottomTabBarMainContainer}>
          {tabs1.map((tab, index) =>
            tab ? (
              <TouchableOpacity
                key={index}
                style={[styles.tab]}
                onPress={() => handleTabPress1(index)}>
                <Image
                  source={tab.icon}
                  style={[
                    styles.tabIcon,
                    index === activeTab ? styles.activeTabIcon : null,
                  ]}
                />
                <Text
                  style={[
                    styles.tabText,
                    index === activeTab ? styles.activeTabText : null,
                  ]}>
                  {tab.name}
                </Text>
              </TouchableOpacity>
            ) : null,
          )}
        </View>
      );
    } else {
      return null; // Agar keyboard visible hai, to bottom tab bar dikhaya nahi jayega
    }
  }

  return (
    <View>
      {BottomSheetView()}
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
    </View>
  );
};

export default BottomTabBar;

const styles = StyleSheet.create({
  BottomTabBarMainContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#cccccc',
  },

  tab: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  activeTabIcon: {
    width: 24,
    height: 24,
    tintColor: theme.colors.primary,
    resizeMode: 'cover',
  },
  tabText: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
});
