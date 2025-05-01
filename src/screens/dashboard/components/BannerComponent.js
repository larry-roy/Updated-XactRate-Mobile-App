import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

const BannerComponent = ({navigation}) => {
  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Check AsyncStorage for visibility status
      const checkBannerVisibility = async () => {
        try {
          const isBannerDismissed = await AsyncStorage.getItem(
            'bannerDismissed',
          );

          // Check if the value is 'true' as a string
          if (isBannerDismissed === 'true') {
            setVisible(true); // Banner is dismissed, don't show
          } else {
            setVisible(false); // Banner is not dismissed, show
          }
        } catch (error) {
          console.error('Error fetching banner visibility:', error);
        }
      };

      checkBannerVisibility();
    }, [navigation]),
  );

  const dismissBanner = async () => {
    try {
      // Store the fact that the banner has been dismissed
      await AsyncStorage.setItem('bannerDismissed', 'false');
      setVisible(false); // Hide the banner after dismissal
    } catch (error) {
      console.error('Error dismissing banner:', error);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.banner}>
      <TouchableOpacity onPress={dismissBanner} style={styles.closeButton}>
        <Text style={styles.closeText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.title}>XactRate Business Management System</Text>
      <Text style={styles.subtitle}>
        Simplify your operations with real-time service tracking, inventory
        management, {'\n'}and client relationship tools—all in one cloud-based
        platform.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: 'green',
    padding: 20,
    paddingVertical: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    margin: 10,
    marginVertical: 15,
  },
  title: {
    fontSize: 35,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'DMSans-Regular',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BannerComponent;
