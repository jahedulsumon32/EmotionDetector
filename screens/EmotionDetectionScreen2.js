import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-react-native';
import Tokenizr from 'tokenizr'; // Import Tokenizr library
import axios from 'axios'; // Import Axios library

const source = {
  model:
    'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json',
  metadata:
    'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json',
};

const EmotionDetectionScreen2 = () => {
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState('');
  const [loading, setLoading] = useState(false);

  const metadata = {};
  const model = null; // Initialize model as needed

  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        await tf.ready();

        // Load model
        model.current = await tf.loadLayersModel(source.model);
        const metadataJson = await fetch(source.metadata);
        metadata.current = await metadataJson.json();
        console.log(model.current);
        //console.log(metadata.current);

        setLoading(false);
        console.log('Model loaded');
      } catch (err) {
        console.log('An error occurred during loading model:', err);
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  const preprocessInput = text => {
    try {
      const tokenized = tokenize(text);
      const sequence = tokenized.map(word => {
        let wordIndex =
          metadata.current.word_index[word] + metadata.current.index_from;
        if (wordIndex > metadata.current.vocabulary_size) {
          wordIndex = 2; // OOV_INDEX
        }
        return wordIndex;
      });

      const paddedSequence = padSequences([sequence], metadata.current.max_len);

      return tf.tensor2d(paddedSequence, [1, metadata.current.max_len]);
    } catch (err) {
      console.log('An error occurred during input preprocessing:', err);
    }
  };

  const tokenize = text => {
    let lexer = new Tokenizr();

    lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, match) => {
      ctx.accept('id');
    });
    lexer.rule(/[+-]?[0-9]+/, (ctx, match) => {
      ctx.accept('number', parseInt(match[0]));
    });
    lexer.rule(/"((?:\\"|[^\r\n])*)"/, (ctx, match) => {
      ctx.accept('string', match[1].replace(/\\"/g, '"'));
    });
    lexer.rule(/\/\/[^\r\n]*\r?\n/, (ctx, match) => {
      ctx.ignore();
    });
    lexer.rule(/[ \t\r\n]+/, (ctx, match) => {
      ctx.ignore();
    });
    lexer.rule(/./, (ctx, match) => {
      ctx.accept('char');
    });
    lexer.input(text);
    return lexer.tokens().map(v => v.value);
  };

  const padSequences = (sequences, maxLen) => {
    return sequences.map(seq => {
      if (seq.length > maxLen) {
        seq.splice(0, seq.length - maxLen);
      }

      if (seq.length < maxLen) {
        seq = Array(maxLen - seq.length)
          .fill(0)
          .concat(seq);
      }

      return seq;
    });
  };

  const detectEmotion = async () => {
    try {
      setLoading(true);
      const input = preprocessInput(text);
      const predictOut = model.current.predict(input);
      const score = predictOut.dataSync()[0];
      predictOut.dispose();
      setEmotion(score >= 0.5 ? 'positive' : 'negative');
    } catch (err) {
      console.log('An error occurred during emotion detection:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText('');
    setEmotion('');
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
    backgroundColor: '#fff',
  },
  input: {
    height: 100,
    width: '100%',
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    backgroundColor: '#f9f9f9',
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  loader: {
    marginTop: 20,
  },
});

export default EmotionDetectionScreen2;
