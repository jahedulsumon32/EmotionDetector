import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const ReviewScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Review Screen</Text>
      <Button title="Click Here" onPress={() => alert('Button Clicked!')} />
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
