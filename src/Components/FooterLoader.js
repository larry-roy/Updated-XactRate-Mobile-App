// FooterLoader.js
import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import theme from '../utils/theme';

const FooterLoader = () => {
  return (
    <View style={{paddingVertical: 20}}>
      <ActivityIndicator
        animating
        size="large"
        color={theme.colors.primary || '#000'}
      />
    </View>
  );
};

export default FooterLoader;
