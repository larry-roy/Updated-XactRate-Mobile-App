import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  ActivityIndicator,
  BackHandler,
  RefreshControl,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import BottomTabBar from '../../Components/BottomTabBar';
import theme from '../../utils/theme';
import ClientItem from './components/ClientItem';
import SearchBar from './components/SearchBar';
import {useOrientation} from '../../utils/orientation';
import {useClients} from '../../hooks/useClients';
import styles from './styles';

const Clients = () => {
  const navigation = useNavigation();
  const orientation = useOrientation();
  const [activeTab, setActiveTab] = useState(2);
  const {
    dataSource,
    loading,
    refreshing,
    searchQuery,
    loadInitialData,
    loadMoreData,
    refreshData,
    searchClients,
    setSearchQuery,
  } = useClients(navigation);

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

  const handleSearch = text => {
    searchClients(text);
    setSearchQuery(text);
  };

  const renderFooter = () => (
    <View style={styles.footer}>
      {!refreshing && loading && (
        <ActivityIndicator
          color={theme.colors.primary}
          size="large"
          style={styles.activityIndicator}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.MainContainer}>
        <SearchBar value={searchQuery} onChangeText={handleSearch} />
        <FlatList
          data={dataSource}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <ClientItem item={item} navigation={navigation} />
          )}
          ListFooterComponent={renderFooter}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              tintColor={'#8bc34a'}
              refreshing={refreshing}
              onRefresh={refreshData}
            />
          }
        />
      </View>
      {/* Uncomment if needed
      <TouchableOpacity
        style={styles.FloatingButton}
        onPress={() =>
          navigation.navigate(NAVIGATION_STRING_CONSTANTS.create_client_screen)
        }>
        <Image
          style={styles.FloatingButtonIcon}
          source={require('../assets/FloatingButton.png')}
        />
      </TouchableOpacity>
      */}
      <BottomTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </SafeAreaView>
  );
};

export default Clients;
