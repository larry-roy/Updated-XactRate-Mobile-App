import {Alert} from 'react-native';

// Global function for showing alert
export default showAlert = (title, message, onConfirm) => {
  Alert.alert(title, message, [
    {
      text: 'No',
      onPress: () => {},
      style: 'no',
    },
    {
      text: 'Yes',
      onPress: onConfirm,
    },
  ]);
};
