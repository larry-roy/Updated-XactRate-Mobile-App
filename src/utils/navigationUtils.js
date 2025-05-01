import {useEffect, useRef} from 'react';
import {Platform, BackHandler} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const useBackHandler = (convertToDraft, loading) => {
  const navigation = useNavigation();
  const isDraftConverted = useRef(false); // To track if the draft has already been converted

  useEffect(() => {
    const backAction = () => {
      console.log('Back button pressed!');

      // Prevent calling convertToDraft if loading is true
      if (!loading && !isDraftConverted.current) {
        isDraftConverted.current = true;
        convertToDraft(); // Call the function if not loading
      }
      return true; // Prevent default back behavior (i.e., navigating back)
    };

    // Handle Android back button
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }

    // Handle iOS back swipe action using beforeRemove event
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      console.log('Screen will be removed!');

      // Trigger only once and if not loading
      if (!loading && !isDraftConverted.current) {
        isDraftConverted.current = true;
        convertToDraft(); // Call the function if not loading
      }
    });

    // Cleanup on unmount
    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      }
      unsubscribe();
    };
  }, [navigation, convertToDraft, loading]); // Add loading as a dependency
};

export default useBackHandler;
