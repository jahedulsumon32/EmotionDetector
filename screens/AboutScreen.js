import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/b1.png')} style={styles.logo} />
      <Text style={styles.title}>Emotion Detection from Text</Text>
      <Text style={styles.description}>
        Our app can be used to analyze text and predict the underlying emotions
        expressed. Whether it's joy, sadness, anger, or excitement, we aim to
        provide accurate insights to enhance user experiences.
      </Text>
      <Text style={styles.subtitle}>Features:</Text>
      <Text style={styles.feature}>- Real-time emotion detection</Text>
      <Text style={styles.feature}>- User-friendly interface</Text>
      <Text style={styles.feature}>- Fast and reliable predictions</Text>
      <Text style={styles.feature}>
        - User can post, like,dislike,comment,rate the post and detect emotion
        of the post.
      </Text>
      <Text style={styles.feature}>- User can find country details</Text>
      <Text style={styles.subtitle}>Developed By:</Text>
      <Text style={styles.teamMember}>Mohammad Jahedul Alam Chy </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000', // Black text color
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#000', // Black text color
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
    color: '#000', // Black text color
  },
  feature: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    color: '#000', // Black text color
  },
  teamMember: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    color: '#000', // Black text color
  },
});

export default AboutScreen;
