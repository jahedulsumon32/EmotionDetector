import React, {useState} from 'react';
import {View, Text, TextInput, ActivityIndicator, Button} from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';
import {fetch} from '@tensorflow/tfjs-react-native';
import {ScrollView} from 'react-native-gesture-handler';

export default function EmotionDetectionScreen4() {
  const [predictions, setPredictions] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loadingModel, setLoadingModel] = useState(false);
  const [model, setModel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadToxicityModel = async () => {
    setLoadingModel(true);
    try {
      await tf.ready();
      const threshold = 0.9;
      const toxicityModel = await toxicity.load(threshold);
      setModel(toxicityModel);
      setLoadingModel(false);
      console.log('model loaded from 1');
      return toxicityModel;
    } catch (error) {
      try {
        await tf.ready();
        const threshold2 = 0.9;
        const toxicityModel2 = await toxicity.load(threshold2, fetch);
        setModel(toxicityModel2);
        setLoadingModel(false);
        console.log('model loaded from 2');
        return toxicityModel2;
      } catch (error) {
        try {
          await tf.ready();
          const threshold3 = 0.9;
          const toxicityModel3 = await toxicity.load(threshold3);
          setModel(toxicityModel3);
          setLoadingModel(false);
          console.log('model loaded from 3');
          return toxicityModel3;
        } catch {
          console.error('Error loading toxicity model:', error);
          setLoadingModel(false);
          return null;
        }
      }
    }
  };

  const classifySentences = async sentences => {
    try {
      const predictions = await model.classify(sentences);
      return predictions;
    } catch (error) {
      console.error('Error classifying sentences:', error);
      return [];
    }
  };

  const handleTextInputChange = text => {
    setInputText(text);
    setPredictions([]);
  };

  const handlePredict = async () => {
    const sentences = [inputText];
    setLoading(true);

    // Simulate a slight delay (you can adjust the duration as needed)
    setTimeout(async () => {
      const predictions = await classifySentences(sentences);
      setPredictions(predictions);
      setLoading(false); // Set loading to false after predictions are received
    }, 100); // Adjust the delay duration as needed
  };

  const handleClear = () => {
    setInputText('');
    setPredictions([]);
  };

  const handleLoadModel = async () => {
    setCancelLoading(true);
    await loadToxicityModel();
    setCancelLoading(false);
  };

  const handleCancelLoading = () => {
    setLoadingModel(false);
    setCancelLoading(false);
  };

  return (
    <ScrollView>
      <View style={{padding: 20}}>
        <TextInput
          style={{
            height: 50,
            borderColor: 'gray',
            borderWidth: 2,
            borderRadius: 10,
            padding: 10,
            marginBottom: 20,
          }}
          placeholder="Enter text to detect toxicity"
          onChangeText={handleTextInputChange}
          value={inputText}
          returnKeyType="done"
        />
        {!loadingModel && model == null && (
          <View style={{alignItems: 'center', marginBottom: 20}}>
            <Button
              onPress={handleLoadModel}
              title="Load Model"
              color="#FF5722"
            />
          </View>
        )}
        {cancelLoading && (
          <View style={{alignItems: 'center', marginBottom: 20}}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>
              Wait Pateintly. It will takes 2 minutes to load the model.
            </Text>
            <Button
              onPress={handleCancelLoading}
              title="Cancel"
              color="#FF5722"
            />
          </View>
        )}

        {model != null && (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button onPress={handlePredict} title="Predict" color="#FF5722" />
            <Button onPress={handleClear} title="Clear" color="#FF5722" />
          </View>
        )}

        {loading && (
          <View style={{alignItems: 'center', marginBottom: 20}}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Predicting............</Text>
          </View>
        )}
        {predictions.length > 0 && (
          <View style={{marginTop: 20}}>
            {predictions.map(prediction => (
              <View key={prediction.label} style={{marginTop: 10}}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: prediction.results.some(result => result.match)
                      ? 'red'
                      : 'black',
                  }}>
                  Label: {prediction.label}
                </Text>
                {prediction.results.map((result, index) => (
                  <Text
                    key={index}
                    style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
                    Match: {result.match ? 'true' : 'false'}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
