import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DatePicker = ({date, setDate}) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(date));
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const updateDate = newDate => {
    const formattedDate = newDate.toISOString().split('T')[0];
    setDate(formattedDate);
    setSelectedDate(newDate);
  };

  const showMode = () => setShow(true);
  const showDatePickerIos = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = newDate => {
    updateDate(newDate);
    hideDatePicker();
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShow(Platform.OS === 'ios');
    updateDate(currentDate);
  };

  return (
    <>
      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        onPress={Platform.OS === 'ios' ? showDatePickerIos : showMode}
        style={styles.container}>
        <Text style={styles.dateText}>{date}</Text>
      </TouchableOpacity>
      {Platform.OS === 'ios' ? (
        <DateTimePickerModal
          isVisible={datePickerVisible}
          mode="date"
          date={selectedDate}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      ) : (
        show && (
          <RNDateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )
      )}
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#808080',
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    marginTop: 18,
    marginLeft: 5,
  },
  container: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B2B9BF',
    marginVertical: 10,
  },
  dateText: {
    color: '#333333',
    fontSize: 16,
    margin: 10,
    fontFamily: 'DMSans-Medium',
  },
});

export default DatePicker;
