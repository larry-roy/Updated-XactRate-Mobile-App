import React, {useCallback, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  View,
  Text,
  BackHandler,
  RefreshControl,
} from 'react-native';
import InventoryCard from './components/InventoryCard';
import styles from './styles';
import NAVIGATION_STRING_CONSTANTS from '../../navigation/NavigarionStringConstants';
import BottomTabBar from '../../Components/BottomTabBar';
import {useInventory} from '../../hooks/useInvantry';
import {useFocusEffect} from '@react-navigation/native';
import theme from '../../utils/theme';

const Inventory_Screen = ({navigation}) => {
  const {dataSource, loading, refreshing, loadInitialData, loadMoreData} =
    useInventory(navigation);

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

  // Render each inventory item
  const renderItem = ({item}) => (
    <InventoryCard
      title={item.title}
      qty={item.quantity}
      reOrderQuantity={item.re_order_quantity}
      amount={item.price}
      onPress={() =>
        navigation.navigate(
          NAVIGATION_STRING_CONSTANTS.create_inventory_screen,
          {
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            re_order_quantity: item.re_order_quantity,
            price: item.price,
            formType: 'update',
          },
        )
      }
    />
  );

  // Render footer for loading more
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <ActivityIndicator
        color={theme.colors.primary}
        size={'small'}
        style={{marginVertical: 16}}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={dataSource}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id || index}`}
        // onEndReached={!loading ? loadMoreData : null} // Update this line
        onEndReachedThreshold={0.2}
        //ListFooterComponent={loading ? renderFooter : null}
        ListEmptyComponent={
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text>No items found.</Text>
          </View>
        }
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            colors={theme.colors.primary}
            refreshing={refreshing}
            onRefresh={loadInitialData}
          />
        }
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() =>
          navigation.navigate(
            NAVIGATION_STRING_CONSTANTS.create_inventory_screen,
          )
        }>
        <Image
          style={styles.imageFloatingButton}
          source={require('../../assets/FloatingButton.png')}
        />
      </TouchableOpacity>
      <BottomTabBar />
    </SafeAreaView>
  );
};

export default Inventory_Screen;
