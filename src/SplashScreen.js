import {StyleSheet, Text, Image, SafeAreaView} from 'react-native';
import {useEffect, useCallback, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import STRING_CONSTANTS from './strings/strings';
import URL_CONFIG from './Components/global-config';
import NAVIGATION_STRING_CONSTANTS from './navigation/NavigarionStringConstants';
import {handleUnauthorizedAccess} from './utils/unauthorizedHandler';
const Splash_Screen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState();

  useEffect(() => {
    getUserToken();
  }, []);

  /**
   * Triggers when screen is focused
   */

  useFocusEffect(
    useCallback(() => {
      getUserToken();
    }, []),
  );

  /**
   * Get data user information and check user token auth
   */

  const getUserToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        // If there's no token, redirect to login
        if (navigation) {
          navigation.navigate(NAVIGATION_STRING_CONSTANTS.login_screen);
        }
        return;
      }

      if (!loading) {
        // Ensure loading is false before making the API call
        // Set loading to true to indicate that API call is in progress
        setLoading(true);

        const options = {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        };

        const response = await fetch(URL_CONFIG.Url + 'api/dashboard', options);
        const responseJson = await response.json();

        // Set loading to false once the response is received
        setLoading(false);

        if (responseJson.status_code === 401) {
          // Unauthorized access
          if (navigation) {
            handleUnauthorizedAccess(navigation);
          }
          return;
        }

        if (responseJson.success === true) {
          // Check the token again after a successful response
          const storedUserToken = await AsyncStorage.getItem('userToken');
          if (!storedUserToken) {
            navigation.navigate(NAVIGATION_STRING_CONSTANTS.login_screen);
          } else {
            navigation.navigate('Root', {
              screen: NAVIGATION_STRING_CONSTANTS.schedule_screen,
            });
          }
        }
      }
    } catch (error) {
      console.warn('Error fetching user token:', error);
      // Make sure to set loading to false in case of error
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.MainContainer}>
      <Image
        style={styles.ImageLogo}
        source={require('./assets/logo_png.png')}
      />
      <Text style={styles.LogoText}>{STRING_CONSTANTS.splash_screen_text}</Text>
    </SafeAreaView>
  );
};

export default Splash_Screen;

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  ImageLogo: {
    alignSelf: 'center',
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
  LogoText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 25,
    fontFamily: 'DMSans-Bold',
  },
});
