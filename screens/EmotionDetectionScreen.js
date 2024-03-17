import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const EmotionDetectionScreen = () => {
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);

  const detectEmotion = async () => {
    setLoading(true);
    try {
      const options = {
        method: 'POST',
        url: 'https://emodex-emotions-analysis.p.rapidapi.com/rapidapi/emotions',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key':
            'ab2f77f9cfmshaef089c6f33afd2p1225abjsn3969ad40952f',
          'X-RapidAPI-Host': 'emodex-emotions-analysis.p.rapidapi.com',
        },
        data: {
          sentence: text,
        },
      };

      const response = await axios.request(options);
      const {sentence} = response.data;

      // Remove the 'text' key pair
      delete sentence.text;

      // Extracting emotion with highest probability
      const maxEmotion = Object.keys(sentence).reduce((a, b) =>
        sentence[a] > sentence[b] ? a : b,
      );
      setEmotion(maxEmotion);
    } catch (error) {
      console.error(error);
      setEmotion('Error');
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText('');
    setEmotion(null);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter text to detect emotion.."
        onChangeText={setText}
        value={text}
      />
      <View style={styles.buttonContainer}>
        <Button title="Detect Emotion" onPress={detectEmotion} />
        <Button title="Clear All" onPress={clearAll} />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : (
        emotion && (
          <View style={styles.card}>
            <Text style={styles.result}>Detected Emotion: {emotion}</Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 100,
    width: '100%',
    borderWidth: 3,
    borderColor: 'black',
    padding: 10,
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  loader: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default EmotionDetectionScreen;
