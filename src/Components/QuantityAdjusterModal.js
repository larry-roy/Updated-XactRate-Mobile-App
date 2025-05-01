import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
} from 'react-native';
import theme from '../utils/theme'; // Ensure theme is correctly imported

const QuantityAdjusterModal = ({
  visible,
  message,
  onClose,
  onChange,
  onSave,
  initialQuantity = 1,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [inputValue, setInputValue] = useState(String(initialQuantity));

  // Sync quantity and input value when modal opens or initialQuantity changes
  useEffect(() => {
    if (visible) {
      setQuantity(initialQuantity);
      setInputValue(String(initialQuantity));
    }
  }, [visible, initialQuantity]);

  // Increment quantity
  const increment = () => {
    setQuantity(prevQuantity => {
      const newQuantity = Number(prevQuantity) + 1;
      setInputValue(String(newQuantity));
      onChange?.(newQuantity); // Notify parent component if onChange is provided
      return newQuantity;
    });
  };

  // Decrement quantity
  const decrement = () => {
    setQuantity(prevQuantity => {
      if (prevQuantity <= 1) return prevQuantity; // Prevent going below 1
      const newQuantity = prevQuantity - 1;
      setInputValue(String(newQuantity));
      onChange?.(newQuantity); // Notify parent component if onChange is provided
      return newQuantity;
    });
  };

  // Handle manual input
  const handleInputChange = text => {
    setInputValue(text); // Update input value immediately
    const parsedQuantity = parseInt(text, 10);
    if (!isNaN(parsedQuantity) && parsedQuantity >= 1) {
      setQuantity(parsedQuantity);
      onChange?.(parsedQuantity); // Notify parent component if onChange is provided
    }
  };

  // Handle save action
  const handleSave = () => {
    const finalQuantity = isNaN(quantity) || quantity < 1 ? 1 : quantity;
    onSave(finalQuantity); // Save the valid quantity
    onClose(); // Close the modal
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <StatusBar
          translucent
          backgroundColor="rgba(0, 0, 0, 0.4)"
          barStyle="dark-content"
        />
        <View style={styles.modalContainer}>
          {message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.button} onPress={decrement}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={handleInputChange}
              keyboardType="numeric"
              selectTextOnFocus
            />
            <TouchableOpacity style={styles.button} onPress={increment}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  message: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: 60,
    height: 40,
    textAlign: 'center',
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#888',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuantityAdjusterModal;
