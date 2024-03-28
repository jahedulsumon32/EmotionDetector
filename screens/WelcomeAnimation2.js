import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Text, Animated, Image} from 'react-native';
import {gsap, Back} from 'gsap-rn'; // Import gsap and Back from gsap-rn
import logoimage from '../assets/b1.jpeg';

const WelcomeAnimation2 = props => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoRef = useRef(null);

  useEffect(() => {
    // Fade animation
    const fadeIn = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    });

    const fadeOut = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    });

    const sequence = Animated.sequence([
      fadeIn,
      Animated.delay(1000),
      fadeOut,
      Animated.delay(1000),
    ]);

    const animation = Animated.loop(sequence);
    animation.start();

    // Set a timeout to stop the animation after 5 seconds
    const timeout = setTimeout(() => {
      animation.stop();
      props.onAnimationComplete(); // Notify parent component that animation is complete
    }, 5000);

    // Clear timeout and stop animation on unmount
    return () => {
      clearTimeout(timeout);
      animation.stop();
    };
  }, [fadeAnim, props]);

  useEffect(() => {
    // Logo animation
    const logo = logoRef.current;
    gsap.to(logo, {
      duration: 5,
      rotation: '360deg', // Use '360deg' instead of 360 for rotation
      scale: 1,
      ease: Back.easeInOut,
      repeat: -1,
      repeatDelay: 3,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image ref={logoRef} style={styles.logo} source={logoimage} />
      <Animated.Text style={[styles.appName, {opacity: fadeAnim}]}>
        Welcome
      </Animated.Text>

      <Animated.Text style={[styles.appDescription, {opacity: fadeAnim}]}>
        Emotion Detection From Text
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
    marginVertical: 100,
  },
  appName: {
    color: 'black',
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
    fontFamily: 'Arial', // Use a clearer font family
  },
  appDescription: {
    color: 'black',
    fontSize: 24,
    marginTop: 20,
    marginBottom: 90,
    textAlign: 'center',
    fontFamily: 'Arial', // Use a clearer font family
  },
  logo: {
    height: 100,
    width: 100,
    marginBottom: 10,
    marginTop: 40,
  },
});

export default WelcomeAnimation2;
