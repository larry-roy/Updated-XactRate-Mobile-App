import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import STRING_CONSTANTS from '../../../strings/strings';
import theme from '../../../utils/theme';
import NAVIGATION_STRING_CONSTANTS from '../../../navigation/NavigarionStringConstants';

const TicketList = ({ tickets, navigation, onTicketPress }) => {
  if (!tickets) return null;

  return (
    <>
      <View style={styles.ViewAllTicketContainer}>
        <Text style={styles.ClientTittleText}>{STRING_CONSTANTS.recent_tickets}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Root', { screen: NAVIGATION_STRING_CONSTANTS.details_screen })}>
          <Text style={styles.ViewTittleText}>View all</Text>
        </TouchableOpacity>
      </View>
      {tickets.length > 0 ? (
        tickets.map((ticket, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onTicketPress(ticket)}
            style={styles.ClientBoxContainer}>
            <Text style={styles.ClientNameText}>{ticket.first_name} {ticket.last_name}</Text>
            <Text style={styles.ClientDetailText}>{ticket.ticket_type_description}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.ClientDetailText}>{ticket.date}</Text>
              {ticket.status == 1 && (
                <View style={styles.ScheduleStatusView}>
                  <Text style={styles.ScheduleText}>{STRING_CONSTANTS.schedule}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={{ paddingVertical: 20 }}>
          <ActivityIndicator size={30} color={theme.colors.primary} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // Move relevant styles here
  ViewAllTicketContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#B2B9BF',
    marginVertical: 10,
    paddingVertical: 10,
  },
  ClientTittleText: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    marginHorizontal: 20,
  },
  ViewTittleText: {
    color: '#478113',
    fontFamily: 'DMSans-Medium',
    fontSize: 13,
    marginHorizontal: 20,
    borderBottomWidth: 0.8,
    borderColor: theme.colors.primary,
  },
  ClientBoxContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 5,
    borderColor: '#B2B9BF',
    borderWidth: 0.8,
    borderRadius: 3,
    padding: 10,
  },
  ClientNameText: {
    color: '#333333',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    margin: 2,
  },
  ClientDetailText: {
    color: '#808080',
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
    margin: 2,
  },
  ScheduleStatusView: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 2,
    borderRadius: 15,
    width: 140,
  },
  ScheduleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'DMSans-Bold',
    textAlign: 'center',
  },
});

export default TicketList;