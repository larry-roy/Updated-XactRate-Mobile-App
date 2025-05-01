import theme from '../../utils/theme';

const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    padding: 16,
  },
  ScreenTittle: {
    color: 'black',
    fontFamily: 'DMSans-Bold',
    fontSize: 22,
    textAlign: 'center',
    margin: 40,
  },
  floatingButton: {
    borderRadius: 50,
    position: 'absolute',
    height: 80,
    width: 80,
    backgroundColor: '#FFFFFF',
    borderColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
    right: 30,
    bottom: 100,
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.38,
    shadowRadius: 5.5,
    elevation: 10,
  },
  imageFloatingButton: {
    resizeMode: 'contain',
    height: 55,
    width: 55,
  },
  CreateButtonStyle: {
    backgroundColor: theme.colors.primary,
    borderWidth: 1,
    borderColor: '#7DE24E',
    alignItems: 'center',
    borderRadius: 5,
    padding: 15,
    marginTop: 20,
  },
  ButtonStyleCancel: {
    backgroundColor: '#D65F1C',
    alignItems: 'center',
    borderRadius: 5,
    padding: 15,
    marginTop: 20,
  },
  ButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
  },
  DeleteTicketButtonStyle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#cccccc',
    alignItems: 'center',
    borderRadius: 5,
    padding: 15,
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  DeleteTicketText: {
    color: '#F44336',
    textAlign: 'center',
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
  },
  DeleteTicketImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#F44336',
    marginHorizontal: 10,
  },
});

export default styles;
