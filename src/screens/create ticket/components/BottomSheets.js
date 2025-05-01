import React, {forwardRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import STRING_CONSTANTS from '../../../strings/strings';
import theme from '../../../utils/theme';

export const ClientListBottomSheet = forwardRef(
  (
    {
      clientNameData,
      selectClientName,
      searchQuery,
      setSearchQuery,
      handleLoadMore,
      moreDataLoading,
      windowWidth,
    },
    ref,
  ) => (
    <RBSheet
      ref={ref}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={windowWidth > 700 ? 750 : 600}
      customStyles={{
        wrapper: {backgroundColor: 'rgba(0, 0, 0, 0.4)'},
        draggableIcon: {backgroundColor: '#000'},
      }}>
      <View style={styles.clientContainer}>
        <Text style={styles.clientTitle}>
          {STRING_CONSTANTS.select_client_bottom_sheet_title}
        </Text>
        <TextInput
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.clientSearchBar}
        />
        <FlatList
          data={clientNameData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.clientItem}
              onPress={() => selectClientName(item, () => ref.current.close())} // Pass close function
            >
              <View style={styles.clientData}>
                <Text
                  style={
                    styles.clientName
                  }>{`${item.fname} ${item.lname}`}</Text>
                <Text style={styles.clientInfo}>{`+${item.phone_no_1}`}</Text>
                <Text style={styles.clientInfo}>{item.email}</Text>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            moreDataLoading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : null
          }
        />
      </View>
    </RBSheet>
  ),
);

export const TicketTypeBottomSheet = forwardRef(
  ({ticketTypeData, selectTicketType}, ref) => (
    <RBSheet
      ref={ref}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={450}
      customStyles={{
        wrapper: {backgroundColor: 'rgba(0, 0, 0, 0.4)'},
        draggableIcon: {backgroundColor: '#000'},
      }}>
      <View style={styles.ticketContainer}>
        <FlatList
          data={ticketTypeData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.ticketItem}
              onPress={() => selectTicketType(item, () => ref.current.close())} // Pass close function
            >
              <Text style={styles.ticketText}>{item.des}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </RBSheet>
  ),
);

const styles = StyleSheet.create({
  clientContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  clientTitle: {
    color: 'black',
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  clientSearchBar: {
    borderRadius: 5,
    backgroundColor: '#EAEAEA',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    color: '#444444',
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  clientItem: {
    margin: 5,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  clientData: {
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderColor: '#cccccc',
    paddingVertical: 10,
  },
  clientName: {
    color: '#333333',
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    margin: 2,
  },
  clientInfo: {
    color: '#808080',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    margin: 2,
  },
  ticketContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  ticketItem: {
    marginHorizontal: 30,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 2,
  },
  ticketText: {
    color: '#000000',
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
  },
});
