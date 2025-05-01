const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  activityIndicator: {
    margin: 15,
  },
  rbsheet: {
    wrapper: {backgroundColor: 'rgba(0, 0, 0, 0.4)'},
    draggableIcon: {backgroundColor: '#000'},
  },
});

export default styles;
