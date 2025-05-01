import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import STRING_CONSTANTS from '../../../strings/strings';

const SearchBar = ({ value, onChangeText }) => {
  return (
    <TextInput
      placeholder={STRING_CONSTANTS.search_client_name}
      placeholderTextColor={'#666666'}
      style={styles.SearchBar}
      value={value}
      onChangeText={onChangeText}
    />
  );
};

const styles = StyleSheet.create({
  SearchBar: {
    height: 50,
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    color: '#000000',
    borderRadius: 5,
    backgroundColor: '#EAEAEA',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#B2B9BF',
    margin: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 5,
  },
});

export default SearchBar;