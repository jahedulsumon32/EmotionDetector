import React from 'react';
import {View, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const VideosScreen = () => {
  const embedUrl = 'https://www.youtube.com';

  return (
    <View style={styles.container}>
      <WebView style={styles.webview} source={{uri: embedUrl}} />
    </View>
  );
};

export default VideosScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
