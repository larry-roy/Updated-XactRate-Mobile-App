const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  MainContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  activityIndicator: {
    margin: 15,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  FloatingButton: {
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
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.38,
    shadowRadius: 5.5,
    elevation: 10,
  },
  FloatingButtonIcon: {
    resizeMode: 'contain',
    height: 55,
    width: 55,
  },
});

export default styles;
