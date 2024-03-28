import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';
import WelcomeAnimation from './WelcomeAnimation'; // Import your WelcomeAnimation component
import WelcomeAnimation2 from './WelcomeAnimation2';

const Dots = ({selected}) => {
  let backgroundColor;

  backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';

  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  );
};

const Skip = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text style={{fontSize: 16}}>Skip</Text>
  </TouchableOpacity>
);

const Next = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text style={{fontSize: 16}}>Next</Text>
  </TouchableOpacity>
);

const Done = ({...props}) => (
  <TouchableOpacity style={{marginHorizontal: 10}} {...props}>
    <Text style={{fontSize: 16}}>Done</Text>
  </TouchableOpacity>
);

const OnboardingScreen = ({navigation}) => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleAnimationComplete = () => {
    setShowOnboarding(true); // Update state to show onboarding screens
  };

  return (
    <>
      {!showOnboarding && (
        <WelcomeAnimation2 onAnimationComplete={handleAnimationComplete} />
      )}
      {showOnboarding && (
        <Onboarding
          SkipButtonComponent={Skip}
          NextButtonComponent={Next}
          DoneButtonComponent={Done}
          DotComponent={Dots}
          onSkip={() => navigation.replace('Login')}
          onDone={() => navigation.navigate('Login')}
          pages={[
            {
              backgroundColor: '#a6e4d0',
              image: <Image source={require('../assets/b1.png')} />,
              title: 'Welcome',
              subtitle: 'Social App With Emotion Detector',
            },
            {
              backgroundColor: '#fdeb93',
              image: <Image source={require('../assets/b2.png')} />,
              title: 'Share Your Thoughts',
              subtitle: 'Share Your Feelings via Post',
            },
            {
              backgroundColor: '#e9bcbe',
              image: <Image source={require('../assets/b3.png')} />,
              title: 'Detect The Emotion of Post',
              subtitle: 'And Understand The Post Context More Clearly',
            },
          ]}
        />
      )}
    </>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
