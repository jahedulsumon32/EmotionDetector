import {View, Text, TextInput, Button, Alert} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import HomeScreen from './HomeScreen'; // Import your HomeScreen component

export default function PhoneLoginScreen() {
  const [mobileNo, setMobileNo] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [confirmData, setConfirmData] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const sendOtp = async () => {
    try {
      if (mobileNo.length !== 11) {
        Alert.alert('Mobile number must be 11 digits long.');
        return;
      }
      console.log('Button is clicked');
      const mobile = '+88' + mobileNo;
      console.log(mobile);
      const response = await auth().signInWithPhoneNumber(mobile);
      console.log('After call' + mobile);
      setConfirmData(response);
      console.log(response);
      Alert.alert('OTP is Sent. Please Verify it.');
    } catch (err) {
      console.log(err);
    }
  };

  const submitOtp = async () => {
    try {
      const response = await confirmData.confirm(otpInput);
      console.log(response);
      setIsVerified(true);
      Alert.alert('Your number is verified');
    } catch (err) {
      console.log(err);
      Alert.alert('Incorrect OTP. Please try again.');
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {!isVerified ? (
        <>
          <TextInput
            style={{borderWidth: 2, width: '80%', marginBottom: 5}}
            placeholder="Enter Your Mobile Number"
            keyboardType="number-pad"
            onChangeText={value => setMobileNo(value)}
          />
          <Button title="Send Otp" onPress={sendOtp} />
          <TextInput
            style={{
              borderWidth: 2,
              width: '80%',
              marginBottom: 5,
              marginTop: 30,
            }}
            placeholder="Enter Your OTP"
            keyboardType="number-pad"
            onChangeText={value => setOtpInput(value)}
          />
          <Button title="Submit" onPress={submitOtp} />
        </>
      ) : (
        <HomeScreen /> // Render HomeScreen when OTP is verified
      )}
    </View>
  );
}
