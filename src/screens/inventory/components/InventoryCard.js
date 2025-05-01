import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

const InventoryCard = ({title, qty, reOrderQuantity, amount, onPress}) => {
  const getStatusStyle = () => {
    if (qty == 0) {
      return styles.outOfStock;
    } else if (Number(qty) <= Number(reOrderQuantity)) {
      return styles.lowStock;
    } else {
      return styles.inStock;
    }
  };

  const getStatusTextColor = () => {
    return qty == 0 ? '#fff' : '#000';
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Qty: {qty}</Text>
          <View style={[styles.statusBadge, getStatusStyle()]}>
            <Text style={[styles.statusText, {color: getStatusTextColor()}]}>
              Re Order Qty: {reOrderQuantity}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.editIcon} onPress={onPress}>
        <Image
          source={require('../../../assets/EditProduct.png')}
          style={styles.editImage}
        />
      </TouchableOpacity>

      <View style={styles.amountContainer}>
        <Text style={styles.amount}>${amount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderColor: '#B2B9BF',
    borderWidth: 0.5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#333333',
    fontFamily: 'DMSans-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  subtitle: {
    color: '#808080',
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  outOfStock: {
    backgroundColor: '#d72929',
  },
  lowStock: {
    backgroundColor: '#ffd600',
  },
  inStock: {
    backgroundColor: '#fff',
    borderColor: '#B2B9BF',
    borderWidth: 0.3,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
  },
  amountContainer: {
    position: 'absolute',
    bottom: 15,
    right: 16,
  },
  amount: {
    fontFamily: 'DMSans-Bold',
    fontSize: 16,
    color: '#333333',
  },
  editIcon: {
    position: 'absolute',
    top: 15,
    right: 16,
  },
  editImage: {
    height: 25,
    width: 25,
  },
});

export default InventoryCard;
