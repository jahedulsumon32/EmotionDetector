import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, ActivityIndicator} from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

const SentimentAnalysis = () => {
  const [model, setModel] = useState(null);
  const [indexFrom, setIndexFrom] = useState(null);
  const [maxLen, setMaxLen] = useState(null);
  const [wordIndex, setWordIndex] = useState(null);
  const [vocabularySize, setVocabularySize] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sentimentResult, setSentimentResult] = useState(null);

  const getMeta = async path => {
    const response = await fetch(path);
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const loadModelAndMetadata = async () => {
      try {
        console.log('Loading model');

        await tf.ready();

        // Set the fetch function to the default fetch provided by React Native
        tf.io.registerLoadRouter(url => {
          if (url.startsWith('https://')) {
            return fetch(url, {method: 'GET'}).then(response =>
              response.arrayBuffer(),
            );
          }
          return null;
        });

        const modelUrl =
          'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json';

        const loadedModel = await fetch(modelUrl)
          .then(response => response.json())
          .then(model => tf.loadLayersModel(tf.io.fromMemory(model)))
          .catch(error => {
            console.error('Error loading model:', error);
            throw error;
          });

        setModel(loadedModel);

        const sentimentMetadata = await getMeta(
          'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json',
        );

        setIndexFrom(sentimentMetadata['index_from']);
        setMaxLen(sentimentMetadata['max_len']);
        setWordIndex(sentimentMetadata['word_index']);
        setVocabularySize(sentimentMetadata['vocabulary_size']);

        setLoading(false); // Set loading to false once everything is loaded
        console.log('Loaded model');
      } catch (error) {
        console.error('Error loading model or metadata:', error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    loadModelAndMetadata();
  }, []);

  const padSequences = (
    sequence,
    maxLen,
    padding = 'pre',
    truncating = 'pre',
    value = 0,
  ) => {
    let paddedSequence = sequence.slice(0, maxLen);

    if (padding === 'pre') {
      paddedSequence = Array.from(
        {length: maxLen - sequence.length},
        () => value,
      ).concat(paddedSequence);
    } else {
      paddedSequence = paddedSequence.concat(
        Array.from({length: maxLen - sequence.length}, () => value),
      );
    }

    return paddedSequence;
  };

  const predictions = async () => {
    if (loading) {
      console.error('Model or metadata is still loading.');
      return;
    }

    if (!model || !indexFrom || !maxLen || !wordIndex || !vocabularySize) {
      console.error('Model or metadata not loaded yet.');
      return;
    }

    const inputText = searchText
      .trim()
      .toLowerCase()
      .replace(/(\.|\,|\!)/g, '')
      .split(' ');
    console.log('Input Text:', inputText);

    const sequence = inputText.map(word => {
      let wordIndexValue = wordIndex[word] + indexFrom;
      if (wordIndexValue === undefined || wordIndexValue > vocabularySize) {
        wordIndexValue = 2; // Or any default value for unknown words
      }
      return wordIndexValue;
    });

    const paddedSequence = padSequences(sequence, maxLen);
    console.log('Padded Sequence:', paddedSequence, typeof paddedSequence);
    console.log('Padded Sequence Length:', paddedSequence.length);

    //
    try {
      // Flatten the input array for tensor creation
      const flattenedInputArray = paddedSequence.flat();

      // Create the tensor from the flattened input array
      const input = tf.tensor(flattenedInputArray, [1, maxLen], 'int32');

      console.log('Input Tensor:', input);
      console.log('Input Shape:', input.shape);

      const predictOut = model.predict(input);

      // Validate model output shape (optional)
      if (predictOut.shape.length !== 1 || predictOut.shape[0] !== 1) {
        throw new Error('Unexpected model output shape:', predictOut.shape);
      }

      const score = predictOut.dataSync()[0];
      predictOut.dispose();

      console.log('Predicted Score:', score);

      setSentimentResult(score > 0.5 ? 'Positive' : 'Negative');
    } catch (error) {
      console.error('Error during prediction:', error);
      // Handle the error gracefully, e.g., display a user-friendly message
    }
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View>
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Enter text for sentiment analysis"
          />
          <Button title="Analyze" onPress={predictions} />
          {sentimentResult && <Text>Sentiment: {sentimentResult}</Text>}
        </View>
      )}
    </View>
  );
};

export default SentimentAnalysis;
