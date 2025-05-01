// components/ScheduleItem.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import NAVIGATION_STRING_CONSTANTS from '../../../navigation/NavigarionStringConstants';

const ScheduleItem = ({ item, navigation }) => {
  const navigateToTicket = () => {
    navigation.navigate(NAVIGATION_STRING_CONSTANTS.ticket_screen, {
      ClientId: item.client_id,
      TicketId: item.id,
      ClientFName: item.first_name,
      ClientLName: item.last_name,
      ClientEmail: item.email,
      ClientMobile: item.phone_no_1,
      TicketDescription: item.ticket_type_description,
      TicketTypeId: item.ticket_type_id,
    });
  };

  return (
    <TouchableOpacity style={styles.dataViewBox} onPress={navigateToTicket}>
      <View style={styles.BoxRow}>
        <View style={styles.dataView}>
          <Text style={styles.ClientName}>
            {item.first_name} {item.last_name}
          </Text>
          <Text style={styles.ScheduleDetailsText}>
            {item.ticket_type_description}
          </Text>
          <Text style={styles.ScheduleDetailsText}>{item.date}</Text>
        </View>
        <TouchableOpacity onPress={navigateToTicket}>
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
  dataViewBox: {
    margin: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 15,
  },
  BoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataView: {
    flex: 1,
  },
  ClientName: {
    color: '#333333',
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    margin: 2,
  },
  ScheduleDetailsText: {
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

export default ScheduleItem;