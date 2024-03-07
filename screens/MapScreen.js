import React from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const MapScreen = () => {
  return (
    <WebView
      source={{
        uri: 'https://www.google.com/maps',
      }}
      style={styles.map}
      geolocationEnabled={true} // Enable geolocation access
      originWhitelist={['*']} // Allow all origins
    />
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapScreen;
