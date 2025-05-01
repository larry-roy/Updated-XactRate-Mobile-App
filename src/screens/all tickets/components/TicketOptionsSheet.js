import React from 'react';
import {View, TouchableOpacity, Text, Image, Alert} from 'react-native';
import STRING_CONSTANTS from '../../../strings/strings';
import {StyleSheet} from 'react-native';

const TicketOptionsSheet = ({
  parameter,
  convertToInvoice,
  EditTicket,
  TicketDetail,
}) => {
  if (!parameter) return null;

  return (
    <>
      {parameter.Status == 0 && (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={convertToInvoice}>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.convert_to_invoice}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/convert.png')} // Adjust path as needed
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={EditTicket}>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.edit_ticket}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/EditProduct.png')} // Adjust path as needed
            />
          </TouchableOpacity>
        </View>
      )}
      {parameter.Status == 1 && (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={convertToInvoice}>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.convert_to_invoice}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/convert.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={EditTicket}>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.edit_ticket}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/EditProduct.png')}
            />
          </TouchableOpacity>
        </View>
      )}
      {parameter.Status == 2 && (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={TicketDetail}>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.ticket_details}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/view.png')} // Adjust path as needed
            />
          </TouchableOpacity>
        </View>
      )}
      {parameter.Status == 3 && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Alert.alert(STRING_CONSTANTS.decline_ticket_alert_box)
            }>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.convert_to_invoice}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/convert.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Alert.alert(STRING_CONSTANTS.decline_ticket_alert_box)
            }>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.ticket_details}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/view.png')}
            />
          </TouchableOpacity>
        </View>
      )}
      {parameter.Status == 4 && (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Alert.alert(STRING_CONSTANTS.locked_ticket_alert_box)
            }>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.convert_to_invoice}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/convert.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={TicketDetail}>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.ticket_details}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/view.png')}
            />
          </TouchableOpacity>
        </View>
      )}
      {parameter.Status == 5 && (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={convertToInvoice}>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.convert_to_invoice}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/convert.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={TicketDetail}>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.ticket_details}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/view.png')}
            />
          </TouchableOpacity>
        </View>
      )}
      {parameter.Status == 6 && (
        <View style={styles.container}>
          <TouchableOpacity style={styles.button} onPress={convertToInvoice}>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.convert_to_invoice}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/convert.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={TicketDetail}>
            <Text style={styles.buttonText}>
              {STRING_CONSTANTS.ticket_details}
            </Text>
            <Image
              style={styles.buttonImage}
              source={require('../../../assets/view.png')}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 25,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
  },
  buttonText: {
    color: 'black',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    textAlign: 'center',
  },
  buttonImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: 'black',
  },
});

export default TicketOptionsSheet;
