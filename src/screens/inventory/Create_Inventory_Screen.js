import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  BackHandler,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Image,
} from 'react-native';
import styles from './styles';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import BottomTabBar from '../../Components/BottomTabBar';
import GlobalInput from './components/GlobalInput';
import STRING_CONSTANTS from '../../strings/strings';
import URL_CONFIG from '../../Components/global-config';
import LoadingModal from '../../Components/LoadingModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Inventory_Screen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {id, title, price, quantity, re_order_quantity, formType} =
    route.params ?? {};

  const [state, setState] = useState({
    id: null,
    title: '',
    price: '',
    quantity: '',
    re_order_quantity: '',
    formType: 'save',
    error: '',
    loading: false,
  });

  const onScreenLoadHandle = async () => {
    setState(prevState => ({
      ...prevState,
      id: id ? id : null,
      title: title ? title : '',
      price: price ? price : '',
      quantity: quantity ? quantity : '',
      re_order_quantity: re_order_quantity ? re_order_quantity : '',
      formType: formType ? formType : 'save',
    }));
  };

  useFocusEffect(
    useCallback(() => {
      onScreenLoadHandle();
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.goBack();
          return true;
        },
      );
      return () => backHandler.remove();
    }, [navigation]),
  );

  /**
   * Submit button on press go to login user
   */

  const Submit = async () => {
    try {
      const {title, price, quantity, re_order_quantity, formType} = state;

      // Validate inputs
      const fields = {
        title: title?.trim(),
        price: parseFloat(price),
        quantity: parseInt(quantity, 10),
        re_order_quantity: parseInt(re_order_quantity, 10),
        formType: formType?.trim(),
      };

      // Check for missing or invalid fields
      const missingField = !fields.title
        ? 'title'
        : isNaN(fields.price) || fields.price <= 0
        ? 'valid price'
        : isNaN(fields.quantity) || fields.quantity < 0
        ? 'valid quantity'
        : isNaN(fields.re_order_quantity) || fields.re_order_quantity < 0
        ? 'valid re-order quantity'
        : null;

      if (missingField) {
        Alert.alert('Validation Error', `Please enter a ${missingField}`);
        return;
      }

      // Set loading state
      setState(prevState => ({...prevState, loading: true}));

      // Make API request
      const userToken = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${URL_CONFIG.Url}api/inventory/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          id: id ? id : null,
          title: fields.title,
          price: fields.price,
          quantity: fields.quantity,
          re_order_quantity: fields.re_order_quantity,
          formType: id ? 'update' : 'save',
        }),
      });

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Inventory saved successfully');
        navigation.goBack();
      } else {
        throw new Error(data.message || 'Failed to save inventory');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      Alert.alert(
        'Error',
        error.message || 'An error occurred while saving the inventory',
      );
    } finally {
      setState(prevState => ({...prevState, loading: false}));
    }
  };

  /**
   * Inventory remove and delete from list function
   */

  const AlertPermission = () =>
    Alert.alert('Xact Rate', 'Do you want to delete inventory?', [
      {
        text: 'Cancel',
        onPress: () => '',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => inventoryRemove(),
      },
    ]);

  const inventoryRemove = async () => {
    setState(prevState => ({...prevState, loading: true}));

    try {
      const userToken = await AsyncStorage.getItem('userToken');

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      };

      const response = await fetch(
        `${URL_CONFIG.Url}api/inventory/delete/${id}`,
        options,
      );
      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'Inventory removed successfully');
        navigation.goBack();
      } else {
        throw new Error(data.message || 'Failed to removed inventory');
      }
    } catch (error) {
      console.warn('Error deleting inventory:', error);
      Alert.alert('Error', 'Something went wrong while removing inventory');
    } finally {
      setState(prevState => ({...prevState, loading: false}));
    }
  };

  // Render each inventory item

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{paddingHorizontal: 20}}>
        <Text style={styles.ScreenTittle}>
          {id ? 'Edit Inventory' : 'Create Inventory'}
        </Text>
        <GlobalInput
          label="Title"
          value={state.title}
          onChangeText={value =>
            setState(prevState => ({
              ...prevState,
              title: value,
            }))
          }
          placeholder="Enter your title"
          keyboardType="default"
        />
        <GlobalInput
          label="price"
          value={String(state.price)}
          onChangeText={value => {
            const numericValue = value.replace(/[^0-9]/g, '');
            setState(prevState => ({
              ...prevState,
              price: numericValue,
            }));
          }}
          placeholder="Enter your price"
          keyboardType="number-pad"
        />

        <GlobalInput
          label="Quantity"
          value={String(state.quantity)}
          onChangeText={value => {
            const numericValue = value.replace(/[^0-9]/g, '');
            setState(prevState => ({
              ...prevState,
              quantity: numericValue,
            }));
          }}
          placeholder="Enter your quantity"
          keyboardType="number-pad"
        />

        <GlobalInput
          label="Re Order Quantity"
          value={String(state.re_order_quantity)}
          onChangeText={value => {
            const numericValue = value.replace(/[^0-9]/g, '');
            setState(prevState => ({
              ...prevState,
              re_order_quantity: numericValue,
            }));
          }}
          placeholder="Enter your re order quantity"
          keyboardType="number-pad"
        />
        {id && (
          <TouchableOpacity
            style={styles.DeleteTicketButtonStyle}
            onPress={() => AlertPermission()}>
            <Image
              style={styles.DeleteTicketImage}
              source={require('../../assets/close.png')}
            />
            <Text style={styles.DeleteTicketText}>Delete Inventory</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.CreateButtonStyle}
          onPress={() => Submit()}>
          <Text style={styles.ButtonText}>Save Inventory</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ButtonStyleCancel}
          onPress={() => navigation.goBack()}>
          <Text style={styles.ButtonText}>
            {STRING_CONSTANTS.cancel_button_label}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <LoadingModal visible={state.loading} message={'Loading...'} />
      <BottomTabBar />
    </SafeAreaView>
  );
};

export default Inventory_Screen;
