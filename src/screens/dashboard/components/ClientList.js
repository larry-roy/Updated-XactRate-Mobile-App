import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import STRING_CONSTANTS from '../../../strings/strings';
import theme from '../../../utils/theme';
import NAVIGATION_STRING_CONSTANTS from '../../../navigation/NavigarionStringConstants';

const ClientList = ({ clients, navigation }) => {
  if (!clients) return null;

  return (
    <>
      <View style={styles.ViewAllClientContainer}>
        <Text style={styles.ClientTittleText}>{STRING_CONSTANTS.recent_clients}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Root', { screen: NAVIGATION_STRING_CONSTANTS.clients_screen })}>
          <Text style={styles.ViewTittleText}>View all</Text>
        </TouchableOpacity>
      </View>
      {clients.length > 0 ? (
        clients.map((client, index) => (
          <TouchableOpacity
            key={index}
            style={styles.ClientBoxContainer}
            onPress={() => navigation.navigate(
              NAVIGATION_STRING_CONSTANTS.client_tickets_screen,
              {
                ClientId: client.id,
                ClientFName: client.fname,
                ClientLName: client.lname,
                ClientEmail: client.email,
                ClientMobile: client.phone_no_1,
              }
            )}>
            <Text style={styles.ClientNameText}>{client.fname} {client.lname}</Text>
            <Text style={styles.ClientDetailText}>{client.email}</Text>
            <Text style={styles.ClientDetailText}>{'+'}{client.phone_no_1}</Text>
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
  ViewAllClientContainer: {
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
});

export default ClientList;