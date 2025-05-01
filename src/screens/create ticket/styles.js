import {StyleSheet} from 'react-native';
import theme from '../../utils/theme';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: 'black',
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
    marginVertical: 10,
    textAlign: 'center',
  },
  label: {
    color: '#808080',
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    marginTop: 18,
    marginLeft: 5,
  },
  fieldView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#B2B9BF',
    marginTop: 10,
  },
  fieldText: {
    color: '#000000',
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  notesLabel: {
    color: '#808080',
    fontFamily: 'DMSans-Medium',
    fontSize: 16,
    marginTop: 18,
    marginLeft: 5,
  },
  notesInput: {
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: '#fff',
    color: 'black',
    fontSize: 16,
    borderColor: '#B2B9BF',
    fontFamily: 'DMSans-Medium',
    padding: 15,
    marginVertical: 10,
  },
  errorMessage: {
    marginVertical: 10,
    color: 'red',
    textAlign: 'center',
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    padding: 15,
    marginTop: 40,
  },
  cancelButton: {
    backgroundColor: '#D65F1C', // Matching original cancel button color
    borderRadius: 5,
    padding: 15,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
  },
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
