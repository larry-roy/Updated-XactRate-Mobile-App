import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const ClientInfo = ({firstName, lastName, email, mobile}) => {
  return (
    <View style={styles.DataView}>
      <Text style={styles.ClientName}>
        {firstName} {lastName}
      </Text>
      <View style={styles.EmailView}>
        <Image
          style={styles.ImageIcon}
          source={require('../../../assets/Email.png')}
        />
        <Text style={styles.ClientData}>{email}</Text>
      </View>
      <View style={styles.EmailView}>
        <Image
          style={styles.ImageIcon}
          source={require('../../../assets/Call.png')}
        />
        <Text style={styles.ClientData}>+{mobile}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  DataView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: '#cccccc',
    paddingVertical: 10,
  },
  ClientName: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 25,
    padding: 8,
    paddingLeft: 30,
  },
  EmailView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30,
  },
  ImageIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: 'black',
  },
  ClientData: {
    color: '#4B4B4B',
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    padding: 8,
  },
});

export default ClientInfo;
