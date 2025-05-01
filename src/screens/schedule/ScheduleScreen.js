// screens/Schedule.js
import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  BackHandler,
  RefreshControl,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import BottomTabBar from '../../Components/BottomTabBar';
import theme from '../../utils/theme';
import STRING_CONSTANTS from '../../strings/strings';
import ScheduleItem from './components/ScheduleItem';
import {useOrientation} from '../../utils/orientation';
import {useSchedules} from '../../hooks/useSchedules';

const Schedule = () => {
  const navigation = useNavigation();
  const orientation = useOrientation();
  const [activeTab, setActiveTab] = useState(1);
  const {
    dataSource,
    loading,
    refreshing,
    refresh,
    loadInitialData,
    loadMoreData,
    refreshData,
  } = useSchedules(navigation);

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          navigation.goBack();
          return true;
        },
      );
      return () => backHandler.remove();
    }, [navigation, loadInitialData]),
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      {!refreshing && loading && (
        <ActivityIndicator
          color={theme.colors.primary}
          size="large"
          style={{margin: 15}}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        {refresh ? (
          <View style={{flex: 1, padding: 20}}>
            <ActivityIndicator size={'large'} color={theme.colors.primary} />
          </View>
        ) : dataSource.length > 0 ? (
          <FlatList
            data={dataSource}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <ScheduleItem item={item} navigation={navigation} />
            )}
            ListFooterComponent={renderFooter}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                tintColor={theme.colors.primary}
                refreshing={refreshing}
                onRefresh={refreshData}
              />
            }
          />
        ) : (
          <View style={{flex: 1, paddingVertical: 2}}>
            <Text style={styles.noDataText}>
              {STRING_CONSTANTS.null_screen_data_string}
            </Text>
          </View>
        )}
      </View>
      <BottomTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  noDataText: {
    color: '#000000',
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
    textAlign: 'center',
    margin: 10,
    backgroundColor: '#eeeeee',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderWidth: 0.3,
    borderColor: 'gray',
  },
});

export default Schedule;
