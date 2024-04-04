import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, ActivityIndicator, Button} from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as toxicity from '@tensorflow-models/toxicity';
import {fetch} from '@tensorflow/tfjs-react-native';
import {ScrollView} from 'react-native-gesture-handler';

export default function EmotionDetectionScreen4() {
  const [predictions, setPredictions] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [model, setModel] = useState(null);

  const loadToxicityModel = async () => {
    setLoading(true); // Set loading to true before loading the model
    try {
      await tf.ready();
      const threshold = 0.9;
      const toxicityModel = await toxicity.load(threshold);
      setModel(toxicityModel);
      setLoading(false); // Set loading to false after the model is loaded
      return toxicityModel;
    } catch (error) {
      try {
        await tf.ready();
        const threshold2 = 0.9;
        const toxicityModel2 = await toxicity.load(threshold2, fetch);
        setModel(toxicityModel2);
        setLoading(false); // Set loading to false after the model is loaded
        return toxicityModel2;
      } catch (error) {
        try {
          await tf.ready();
          const threshold3 = 0.9;
          const toxicityModel3 = await toxicity.load(threshold3);
          setModel(toxicityModel3);
          setLoading(false); // Set loading to false after the model is loaded
          console.log('model loaded');

          return toxicityModel3;
        } catch {
          console.error('Error loading toxicity model:', error);
          setLoading(false); // Set loading to false if there's an error
          return null;
        }
      }
    }
  };

  const classifySentences = async sentences => {
    setLoading2(true);
    try {
      const predictions = await model.classify(sentences);

      return predictions;
    } catch (error) {
      console.error('Error classifying sentences:', error);
      setLoading2(false); // Set loading2 to false if there's an error
      return [];
    }
  };

  useEffect(() => {
    loadToxicityModel();
  }, []);

  const handleTextInputChange = text => {
    setInputText(text);
    setPredictions([]);
  };

  const handlePredict = () => {
    const sentences = [inputText];
    classifySentences(sentences).then(predictions => {
      setPredictions(predictions);
      setLoading2(false);
    });
  };

  const handleClear = () => {
    setInputText('');
    setPredictions([]);
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
          // multiline={true}
          // textAlignVertical="top"
          placeholder="Enter text to detect toxicity"
          onChangeText={setInputText}
          value={inputText}
          returnKeyType="done"
        />
        {!loading && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}>
            <Button onPress={handlePredict} title="Predict" color="#FF5722" />
            <Button onPress={handleClear} title="Clear" color="#FF5722" />
          </View>
        )}
        <View style={{marginTop: 10}}>
          {loading && (
            <View style={{alignItems: 'center'}}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>
                Wait 2 minutes patiently.Don't go to other screens.Loading
                model...
              </Text>
            </View>
          )}
        </View>

        <View style={{marginTop: 10}}>
          {loading2 && (
            <View style={{alignItems: 'center'}}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Predicting....</Text>
            </View>
          )}
        </View>

        <View style={{marginTop: 10}}>
          {loading2 ? (
            <View style={{alignItems: 'center', marginTop: 50}}>
              <Text>Predicting....</Text>
            </View>
          ) : (
            predictions.map(prediction => (
              <View key={prediction.label} style={{marginTop: 20}}>
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
                  <View key={index} style={{marginTop: 10}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: 'black',
                      }}>
                      Match: {result.match ? 'true' : 'false'}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
