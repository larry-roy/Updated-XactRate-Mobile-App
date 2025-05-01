// components/InvoiceDetails.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFilePdf} from '@fortawesome/free-regular-svg-icons';
import STRING_CONSTANTS from '../../../strings/strings';
import URL_CONFIG from '../../../Components/global-config';

const windowWidth = Dimensions.get('window').width;

const InvoiceDetails = ({
  invoices,
  products,
  serviceAgreements,
  inventory,
  customProducts,
  timeSheet,
  onDownloadPress,
}) => {
  if (!invoices || invoices.length === 0) {
    return <Text style={styles.invoicesTotalText}>No invoice available</Text>;
  }
  const renderItem = (item, type) => {
    const isDesktop = windowWidth > 700;
    let qty, code, desc, labour, amount;

    switch (type) {
      case 'product':
        qty = item.quantity;
        code = item.product_no;
        desc = item.product_description || 'Product';
        labour = item.labour;
        amount = item.total || item.amount;
        break;
      case 'serviceAgreement':
        qty = item.quantity;
        code = item.service_id;
        desc = 'Service Agreement';
        labour = '-';
        amount = item.amount;
        break;
      case 'inventory':
        qty = item.quantity;
        code = item.title;
        desc = 'inventory';
        labour = '-';
        amount = item.amount;
        break;
      case 'customProduct':
        qty = item.quantity;
        code = item.product_code;
        desc = item.product_name || 'Custom Product';
        labour = item.labour;
        amount = item.total || item.amount;
        break;
      case 'timeSheet':
        qty = 1;
        code = STRING_CONSTANTS.td_time_title;
        desc = 'Travel and Diagnostic Time';
        labour = '-';
        amount = item.total;
        break;
    }

    return isDesktop ? (
      <View style={styles.bodyRow}>
        <Text style={[styles.bodyCell, {flex: 1}]}>{qty}</Text>
        <Text style={[styles.bodyCell, {flex: 2}]}>{code}</Text>
        <Text style={[styles.bodyCell, {flex: 2}]}>{desc}</Text>
        <Text style={[styles.bodyCell, {flex: 1}]}>{labour}</Text>
        <Text style={[styles.bodyCell, {flex: 1}]}>{amount}</Text>
      </View>
    ) : (
      <View style={styles.productsView}>
        <Text numberOfLines={1} style={styles.productCodeText}>
          {code}
        </Text>
        <Text numberOfLines={1} style={styles.productText}>
          {STRING_CONSTANTS.description_label}: {desc}
        </Text>
        <Text style={styles.productText}>
          {STRING_CONSTANTS.product_quantity}: {qty}
        </Text>
        <Text style={styles.productText}>
          {STRING_CONSTANTS.labor_label}: {labour}
        </Text>
        <Text style={styles.productAmountText}>
          {STRING_CONSTANTS.product_amount_sign}
          {amount}
        </Text>
      </View>
    );
  };

  return (
    <>
      {invoices.map((item, index) => (
        <View key={index}>
          <View style={styles.invoicesDateView}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Date:</Text>
              <Text style={styles.dateValue}>{item.date}</Text>
            </View>
            <TouchableOpacity
              style={styles.PdfDownloadButton}
              onPress={onDownloadPress}>
              <FontAwesomeIcon icon={faFilePdf} size={20} color="#fff" />
              <Text style={styles.PdfDownloadButtonText}>
                {STRING_CONSTANTS.download_pdf_text}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Products Table/View */}
          <Text style={styles.Tittle}>
            {windowWidth < 700 ? 'Products' : ''}
          </Text>
          <View style={styles.container}>
            {windowWidth > 700 && (
              <View style={styles.headerRow}>
                <Text style={[styles.headerCell, {flex: 1}]}>Qty</Text>
                <Text style={[styles.headerCell, {flex: 2}]}>Product Code</Text>
                <Text style={[styles.headerCell, {flex: 2}]}>Description</Text>
                <Text style={[styles.headerCell, {flex: 1}]}>Level</Text>
                <Text style={[styles.headerCell, {flex: 1}]}>Amount</Text>
              </View>
            )}
            {products.map((product, idx) => (
              <View key={`product-${idx}`}>
                {renderItem(product, 'product')}
              </View>
            ))}
            {serviceAgreements.map((agreement, idx) => (
              <View key={`service-${idx}`}>
                {renderItem(agreement, 'serviceAgreement')}
              </View>
            ))}
            {inventory.map((item, idx) => (
              <View key={`inventory-${idx}`}>
                {renderItem(item, 'inventory')}
              </View>
            ))}
            {customProducts.map((custom, idx) => (
              <View key={`custom-${idx}`}>
                {renderItem(custom, 'customProduct')}
              </View>
            ))}
            {timeSheet.map((time, idx) => (
              <View key={`time-${idx}`}>{renderItem(time, 'timeSheet')}</View>
            ))}
          </View>

          {/* Invoice Summary */}
          <View style={styles.MainContainer}>
            <View style={styles.summaryContainer}>
              <View style={styles.invoicesDataView}>
                <Text style={styles.invoicesText}>Service Agreements</Text>
                <Text style={styles.invoicesText}>
                  {STRING_CONSTANTS.product_amount_sign}0.00
                </Text>
              </View>
              <View style={styles.invoicesDataView}>
                <Text style={styles.invoicesTotalText}>
                  {STRING_CONSTANTS.total_ticket_details}
                </Text>
                <Text style={styles.invoicesTotalText}>
                  {STRING_CONSTANTS.product_amount_sign}
                  {item.total}
                </Text>
              </View>
              <View style={styles.invoicesDataView}>
                <Text style={styles.invoicesText}>Paid</Text>
                <Text style={styles.invoicesText}>
                  {STRING_CONSTANTS.product_amount_sign}
                  {item.paid}
                </Text>
              </View>
              <View style={styles.invoicesDataView}>
                <Text style={styles.invoicesText}>
                  {STRING_CONSTANTS.balance_due}
                </Text>
                <Text style={styles.invoicesText}>
                  {STRING_CONSTANTS.product_amount_sign}
                  {item.balance || '0.00'}
                </Text>
              </View>
            </View>

            <View style={styles.signatureContainer}>
              <Image
                style={styles.signatureImage}
                source={{
                  uri: `${URL_CONFIG.Url}assets/images/signature/${item.signature}`,
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                width: '25%',
                gap: 10,
              }}>
              <View
                style={{
                  width: '100%',
                  backgroundColor: '#000',
                  padding: 1,
                  alignSelf: 'flex-end',
                }}
              />
              <Text style={styles.signatureText}>Signature</Text>
            </View>
          </View>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  Tittle: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
    padding: 10,
  },
  MainContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  invoicesDateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dateLabel: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 16,
    padding: 2,
  },
  dateValue: {
    textDecorationLine: 'underline',
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 16,
    padding: 2,
  },
  PdfDownloadButton: {
    padding: 5,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: '#cccccc',
    backgroundColor: '#ff5d48',
    flexDirection: 'row',
    alignItems: 'center',
  },
  PdfDownloadButtonText: {
    color: '#fff',
    fontFamily: 'DMSans-Bold',
    fontSize: 14,
    marginHorizontal: 5,
  },
  container: {flex: 1, padding: 16, paddingTop: 30},
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#4d4d4d',
    borderWidth: 0.5,
    borderColor: '#4d4d4d',
  },
  headerCell: {
    padding: 10,
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: '#C1C0B9',
    color: '#fff',
    fontFamily: 'DMSans-Bold',
  },
  bodyRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#cccccc',
  },
  bodyCell: {
    padding: 10,
    textAlign: 'center',
    borderWidth: 0.5,
    borderColor: '#C1C0B9',
    fontFamily: 'DMSans-Medium',
  },
  productsView: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B2B9BF',
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
  productCodeText: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    padding: 2,
  },
  productText: {
    color: '#4B4B4B',
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
    padding: 2,
  },
  productAmountText: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 17,
    padding: 2,
    alignSelf: 'flex-end',
  },
  invoicesDataView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  invoicesText: {
    color: '#4B4B4B',
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    padding: 2,
  },
  invoicesTotalText: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 16,
    padding: 2,
  },
  summaryContainer: {
    borderWidth: 1,
    borderColor: '#B2B9BF',
    padding: 8,
    marginVertical: 10,
    borderRadius: 3,
    backgroundColor: windowWidth > 700 ? '#fff' : '#F5F5F5',
  },
  signatureContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 10,
    marginHorizontal: 30,
  },
  signatureImage: {
    height: 120,
    width: 120,
  },
  signatureText: {
    fontSize: 15,
    color: 'black',
    fontFamily: 'DMSans-Medium',
    textAlign: 'center',
  },
});

export default InvoiceDetails;
