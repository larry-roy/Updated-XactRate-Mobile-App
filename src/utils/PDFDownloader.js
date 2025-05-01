import RNFetchBlob from 'rn-fetch-blob';
import {Platform, Alert} from 'react-native';
import STRING_CONSTANTS from '../strings/strings';
import {downloadInvoicePDF} from '../api/invoiceService';

export const usePDFDownloader = ticketId => {
  const downloadPdfAlert = () => {
    Alert.alert(
      STRING_CONSTANTS.default_alert_box_tittle,
      STRING_CONSTANTS.download_invoice_alert_box,
      [
        {text: 'NO', onPress: () => '', style: 'cancel'},
        {text: 'YES', onPress: downloadFile},
      ],
    );
  };

  const downloadFile = async () => {
    try {
      const {url, headers} = await downloadInvoicePDF(ticketId);
      const {config, android, ios, fs} = RNFetchBlob;
      const mimeType = 'application/pdf';
      const downloadDir =
        Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;

      const options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          mediaScannable: true,
          notification: true,
          path: `${downloadDir}/invoice.pdf`,
          description: '',
          mimeType,
        },
        ios: {
          path: `${downloadDir}/invoice.pdf`,
          description: '',
          mimeType,
        },
        appendExt: 'pdf',
      };

      const res = await config(options).fetch('GET', url, headers);

      if (Platform.OS === 'ios') {
        ios.openDocument(res.data);
      } else {
        android.actionViewIntent(res.path(), mimeType);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return {downloadPdfAlert};
};
