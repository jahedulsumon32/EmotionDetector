import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {
  Tensor,
  TensorflowModel,
  useTensorflowModel,
  loadTensorflowModel,
} from 'react-native-fast-tflite';

function tensorToString(tensor) {
  return `\n  - ${tensor.dataType} ${tensor.name}[${tensor.shape}]`;
}

function modelToString(model) {
  return (
    `TFLite Model (${model.delegate}):\n` +
    `- Inputs: ${model.inputs.map(tensorToString).join('')}\n` +
    `- Outputs: ${model.outputs.map(tensorToString).join('')}`
  );
}

export default function App() {
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      const model = await loadTensorflowModel(
        require('../assets/emotion_detection_model2.tflite'),
      );
      setModel(model);
      console.log(`Model loaded! Shape:\n${modelToString(model)}]`);

      const actualModel = model.state === 'loaded' ? model.model : model;
      setModel(actualModel);
      // console.log(`Actual Model is! Shape:\n${modelToString(actualModel)}]`);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };

  const predictEmotion = async text => {
    try {
      setLoading(true);
      const preprocessT = preprocessText(text);
      const outputData = await model.runSync([preprocessT]);
      console.log(outputData);
      // Handle the output data as needed
    } catch (error) {
      console.error('Error predicting emotion:', error);
    } finally {
      setLoading(false);
    }
  };

  const MAX_SEQUENCE_LENGTH = 32;

  const preprocessText = text => {
    const tokens = text.toLowerCase().split(/\W+/);
    const paddedSequence = [];
    for (let i = 0; i < MAX_SEQUENCE_LENGTH; i++) {
      paddedSequence.push(i < tokens.length ? tokens[i] : 0);
    }
    return paddedSequence;
  };

  const handlePredict = async () => {
    await predictEmotion(text);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TextInput
        style={{width: '80%', marginBottom: 10, borderWidth: 1, padding: 10}}
        placeholder="Enter text"
        onChangeText={value => setText(value)}
        value={text}
      />
      <Button
        title="Predict Emotion"
        onPress={handlePredict}
        disabled={loading}
      />
      {loading && <Text>Loading...</Text>}
      {emotion !== '' && <Text>Predicted Emotion: {emotion}</Text>}
    </View>
  );
}
