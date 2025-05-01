import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  MainContainer: {
    flex: 1,
    padding: 8,
  },
  dashboardContainer: {
    alignItems: 'center',
    flex: 1,
  },
  XrLogo: {
    alignSelf: 'center',
    width: 150,
    height: 80,
    resizeMode: 'contain',
  },
  UserNameTittle: {
    textAlign: 'center',
    color: 'black',
    fontFamily: 'DMSans-Bold',
    fontSize: 20,
    margin: 10,
    fontWeight: '700',
  },
});

export default styles;
