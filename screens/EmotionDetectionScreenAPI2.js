import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

const EmotionDetectionScreenAPI2 = () => {
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allDetectedEmotions, setAllDetectedEmotions] = useState([]);
  const [showEmotions, setShowEmotions] = useState(true);

  const handleCloseEmotions = () => {
    setShowEmotions(false);
  };

  const detectEmotion = async () => {
    setLoading(true);
    try {
      var myHeaders = new Headers();
      myHeaders.append('apikey', 'HJW7cqduX5izdQ4EBIlN2ifcGzIu2IFO');

      var raw = JSON.stringify({
        text: text,
      });

      var requestOptions = {
        method: 'POST',
        redirect: 'follow',
        headers: myHeaders,
        body: raw,
      };

      const response = await fetch(
        'https://api.apilayer.com/text_to_emotion',
        requestOptions,
      );
      const result = await response.json();

      // Extracting emotions with their probabilities
      const emotions = Object.keys(result).map(emotion => ({
        emotion,
        score: result[emotion],
      }));

      // Update detected emotions
      setAllDetectedEmotions(emotions);

      // Extracting emotion with highest probability
      const maxEmotion = Object.keys(result).reduce((a, b) =>
        result[a] > result[b] ? a : b,
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
    setAllDetectedEmotions([]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline={true}
        textAlignVertical="top"
        placeholder="Enter text to detect emotion.."
        onChangeText={setText}
        value={text}
      />
      <View style={styles.buttonContainer}>
        <Button
          color="#8a2be2"
          title="Detect Emotion"
          onPress={detectEmotion}
          disabled={loading || text.trim() === ''}
        />
        <Button title="Clear All" onPress={clearAll} color="#8a2be2" />
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : (
        emotion && (
          <View style={styles.card}>
            {!loading && allDetectedEmotions.length > 0 && showEmotions && (
              <View style={styles.detectedEmotionsContainer}>
                <TouchableOpacity
                  onPress={handleCloseEmotions}
                  style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                {allDetectedEmotions.map(({emotion, score}, index) => (
                  <View key={index} style={styles.detectedEmotionContainer}>
                    <Text
                      style={
                        styles.detectedEmotionText
                      }>{`${emotion}: ${score.toFixed(2)}`}</Text>
                  </View>
                ))}
              </View>
            )}
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
    width: '100%',
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    width: '100%',
  },
  loader: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  detectedEmotionsContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',
  },
  detectedEmotionContainer: {
    marginBottom: 5,
  },
  detectedEmotionText: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#333',
  },
});

export default EmotionDetectionScreenAPI2;
