import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerActions} from '@react-navigation/native';
import URL_CONFIG from './global-config';
import NAVIGATION_STRING_CONSTANTS from '../navigation/NavigarionStringConstants';
import {Dimensions} from 'react-native';
import theme from '../utils/theme';
import {useOrientation} from '../utils/orientation';

const CustomDrawer = props => {
  const navigation = useNavigation();
  const orientation = useOrientation();
  const [loading, setLoading] = useState(false);
  const windowWidth = Dimensions.get('window').width;

  async function customProductIdNull() {
    var customProductId = 0;
    try {
      AsyncStorage.setItem('customProductId', JSON.stringify(customProductId));
    } catch (error) {
      console.warn(error);
    }
  }

  function invoiceOnPress() {
    navigation.navigate(NAVIGATION_STRING_CONSTANTS.ticket_screen);
    navigation.dispatch(DrawerActions.closeDrawer());
    customProductIdNull();
  }

  function inventoryOnPress() {
    navigation.navigate(NAVIGATION_STRING_CONSTANTS.inventory_screen);
    navigation.dispatch(DrawerActions.closeDrawer());
  }

  const showDeleteAlert = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Yes',
          onPress: () => {
            deleteAccount();
          },
        },
        {
          text: 'No',
          onPress: () => {
            console.log('Account deletion canceled');
          },
        },
      ],
      {cancelable: false},
    );
  };

  /**
   * Logout function
   */
  const logout = async () => {
    setLoading(true);

    try {
      var userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        console.log('User token is not available');
        setLoading(false);
        return;
      }

      const response = await fetch(URL_CONFIG.Url + 'api/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });

      const responseJson = await response.json();

      if (responseJson.success === 'true') {
        await AsyncStorage.clear();
        navigation.navigate(NAVIGATION_STRING_CONSTANTS.login_screen);
      } else {
        console.log('Logout failed:', responseJson);
      }
    } catch (error) {
      console.warn('Logout Error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete Account function
   */

  const deleteAccount = async () => {
    setLoading(true);

    try {
      var userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        console.log('User token is not available');
        setLoading(false);
        return;
      }

      const response = await fetch(URL_CONFIG.Url + 'api/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });

      const responseJson = await response.json();

      if (responseJson.success === 'true') {
        await AsyncStorage.clear();
        navigation.navigate(NAVIGATION_STRING_CONSTANTS.login_screen);
        Alert.alert(
          'Important Notice',
          "Your account will be automatically deleted after 90 days if you don't log in before that.",
          [
            {
              text: 'OK',
              onPress: () => console.log('OK Pressed'),
            },
          ],
          {cancelable: false},
        );
      } else {
        console.log('Logout failed:', responseJson);
      }
    } catch (error) {
      console.warn('Logout Error:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 20}}>
          <Image
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              width: 220,
              height: 130,
              resizeMode: 'contain',
            }}
            source={require('../assets/logo_png.png')}
          />
          <DrawerItemList {...props} />
          {windowWidth < 700 && (
            <TouchableOpacity onPress={() => invoiceOnPress()}>
              <Text
                style={{
                  fontFamily: 'DMSans-Bold',
                  fontSize: 15,
                  color: '#333333',
                  marginLeft: 20,
                  marginTop: 18,
                  fontWeight: '600',
                }}>
                Ticket
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => inventoryOnPress()}>
            <Text
              style={{
                fontFamily: 'DMSans-Bold',
                fontSize: 15,
                color: '#333333',
                marginLeft: 20,
                marginTop: 18,
                fontWeight: '600',
              }}>
              Inventory
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={logout}>
            <Text
              style={{
                fontFamily: 'DMSans-Bold',
                fontSize: 15,
                color: '#333333',
                marginLeft: 20,
                marginTop: 20,
                fontWeight: '600',
              }}>
              Logout
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={showDeleteAlert}>
            <Text
              style={{
                fontFamily: 'DMSans-Bold',
                fontSize: 15,
                color: 'red',
                marginLeft: 20,
                marginTop: 20,
                fontWeight: '600',
              }}>
              Delete Account
            </Text>
          </TouchableOpacity> */}
        </View>
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
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;
