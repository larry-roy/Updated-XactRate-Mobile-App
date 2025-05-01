// TicketItem.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import STRING_CONSTANTS from '../../../strings/strings';
import theme from '../../../utils/theme';

const TicketItem = ({ item, onPress }) => {
  // Updated status configuration
  const STATUS_CONFIG = {
    '0': { color: '#6c757d', text: STRING_CONSTANTS.draft },  // Schedule
    '1': { color: theme.colors.primary, text: STRING_CONSTANTS.schedule },  // Schedule
    '2': { color: '#f1b53d', text: STRING_CONSTANTS.close },     // Closed
    '3': { color: '#ff5d48', text: STRING_CONSTANTS.decline },   // Decline
    '4': { color: 'rgb(9, 120, 184)', text: 'Locked' },         // Locked
    '5': { color: '#3db9dc', text: STRING_CONSTANTS.suspend },   // Suspend
  };

  // Get status config with fallback to schedule
  const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG['0'];

  return (
    <TouchableOpacity 
      onPress={() => onPress(item)} 
      style={styles.ClientBoxContainer}
    >
      
      <Text style={styles.ClientDetailText}>
        {item.ticket_type_description}
      </Text>
      <View style={styles.statusContainer}>
        <Text style={styles.ClientDetailText}>{item.date}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
          <Text style={styles.StatusText}>{statusConfig.text}</Text>
        </View>
      </View>
      <Text style={styles.ticketNotes}>
        {item.ticket_notes}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ClientBoxContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginVertical: 5,
    borderColor: '#B2B9BF',
    borderWidth: 0.5,
    borderRadius: 3,
    padding: 10,
  },
  ClientNameText: {
    color: '#333333',
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    margin: 2,
  },
  ClientDetailText: {
    color: '#808080',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    margin: 2,
  },
  StatusText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'DMSans-Bold',
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 18,
    paddingVertical: 2,
    borderRadius: 15,
    width: 140,
  },
  ticketNotes: {
    color: '#333333',
    fontSize: 11,
    fontFamily: 'DMSans-Regular',
  },
});

export default TicketItem;