import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import NAVIGATION_STRING_CONSTANTS from '../../../navigation/NavigarionStringConstants';

const ClientItem = ({item, navigation}) => {
  const navigateToClientTickets = () => {
    navigation.navigate(NAVIGATION_STRING_CONSTANTS.client_tickets_screen, {
      ClientId: item.id,
      ClientFName: item.fname,
      ClientLName: item.lname,
      ClientEmail: item.email,
      ClientMobile: item.phone_no_1,
    });
  };

  return (
    <TouchableOpacity
      style={styles.BoxContainer}
      onPress={navigateToClientTickets}>
      <View style={styles.BoxDataContainer}>
        <View style={styles.BoxData}>
          <Text style={styles.BoxDataClientNameText}>
            {item.fname} {item.lname}
          </Text>
          <Text style={styles.BoxDataClientDetailText}>{item.email}</Text>
          <Text style={styles.BoxDataClientDetailText}>+{item.phone_no_1}</Text>
        </View>
        <TouchableOpacity onPress={navigateToClientTickets}>
          <Image
            style={styles.ViewIcon}
            source={require('../../../assets/ViewIcon.png')}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  BoxContainer: {
    margin: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 15,
  },
  BoxDataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  BoxData: {
    flexDirection: 'column',
  },
  BoxDataClientNameText: {
    color: '#333333',
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    margin: 2,
  },
  BoxDataClientDetailText: {
    color: '#808080',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    margin: 2,
  },
  ViewIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    tintColor: 'black',
  },
});

export default ClientItem;
