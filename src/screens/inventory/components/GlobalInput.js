import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

const GlobalInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        {...props}
        placeholderTextColor={'#000000'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginTop: 20,
  },
  label: {
    color: '#808080',
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    paddingVertical: 20,
    color: '#000000',
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
  },
});

export default GlobalInput;
