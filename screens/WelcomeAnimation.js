// WelcomeAnimation.js
import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';

const WelcomeAnimation = ({onAnimationComplete}) => {
  const [isVisible, setIsVisible] = useState(true);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Hide the animation after 3000ms
    const timeout = setTimeout(() => {
      setIsVisible(false);
      onAnimationComplete(); // Notify parent component that animation is complete
    }, 3000);

    // Clear timeout on unmount
    return () => clearTimeout(timeout);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {isVisible && (
        <Animated.View
          style={{
            ...styles.animationView,
            transform: [{rotate: spin}],
          }}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.title}>Emotion Detection</Text>
          <Text style={styles.title}>from Text</Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8a2be2', // Change background color to a nice blue
  },
  animationView: {
    backgroundColor: '#4285f4',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
});

export default WelcomeAnimation;
