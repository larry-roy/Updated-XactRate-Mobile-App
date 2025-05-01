import React, { useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import theme from '../utils/theme';

const SlidingBanner = () => {
    const staticData = [
        {
          id: '1',
          title: 'Stay Cool with Our AC Solutions! - Beat the Heat with Advanced Technology',
          image: require('../assets/1.png'),
          description:
            'Enjoy a cool, comfortable environment all year round with our top-of-the-line AC systems. Stay relaxed even on the hottest days with advanced cooling technology that ensures you stay refreshed.',
        },
        {
          id: '2',
          title: 'Keep Warm with Our Heating Systems! - Stay Cozy in Winter',
          image: require('../assets/2.png'),
          description:
            'Stay cozy and warm even during the coldest months with our efficient heating solutions. Our systems are designed to provide warmth without compromising on energy efficiency, keeping your home comfortable all winter long.',
        },
        {
          id: '3',
          title: 'Regular Maintenance for Peak Performance! - Keep Your Systems Running Like New',
          image: require('../assets/3.png'),
          description:
            'Ensure your systems run smoothly and efficiently with regular maintenance services. Regular checkups prevent costly repairs and help maintain peak performance, so your AC and heating systems work flawlessly year-round.',
        },
      ];
      

  const carouselRef = useRef(null);
  const sliderWidth = Dimensions.get('window').width;
  const itemWidth = sliderWidth * 0.85;

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.overlay}>
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text numberOfLines={2} style={styles.description}>
              {item.description}
            </Text>
            <TouchableOpacity style={styles.shopButton}>
              <Text style={styles.shopText}>Learn more</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={staticData}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        autoplay={true}
        autoplayInterval={3000}
        loop={true}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.7}
      />
    </View>
  );
};

export default SlidingBanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  slide: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end', // Align content to the top
    alignItems: 'flex-start', // Align content to the left
    padding: 20, // Add padding for spacing from edges
    width:'70%'
  },
  content: {
    alignItems: 'flex-start', // Align content to the left side
    justifyContent: 'flex-start', // Align content to the top
    padding: 10,
  },
  title: {
    fontSize: 22,
    color: theme.colors.secondary,
    fontFamily: "DMSans-Bold",
    marginBottom: 10, // Space between title and description
  },
  description: {
    fontSize: 14,
    color: theme.colors.secondary,
    fontFamily: "DMSans-Medium",
    marginBottom: 15, // Space between description and button
  },
  shopButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  shopText: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontFamily: theme.fonts.DMSansMedium,
    textAlign: 'center',
  },
});
