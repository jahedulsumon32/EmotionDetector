import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import {Alert} from 'react-native';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [isValidEmail, setIsValidEmail] = useState(true); // State to track email validity
  const [isValidPassword, setIsValidPassword] = useState(true); // State to track password validity

  const {register} = useContext(AuthContext);

  // Function to validate email using regex
  const validateEmail = email => {
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
  };

  const validatePassword = password => {
    if (!password || password.length <= 0) {
      return false;
    }
    return true;
  };

  const handleRegister = () => {
    // Check if email is valid before attempting login
    if (!validateEmail(email)) {
      setIsValidEmail(false);
      Alert.alert(
        'Unvalid Email. Please try again with correct amail address.',
      );
      return;
    }

    if (!validatePassword(password)) {
      setIsValidPassword(false);
      Alert.alert('Password cannot be empty');
      return;
    }
    setIsValidPassword(true);
    setIsValidEmail(true);
    if (confirmPassword !== password) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    register(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an account</Text>

      <FormInput
        labelValue={email}
        onChangeText={userEmail => {
          setEmail(userEmail);
          // Validate email on each change and update isValidEmail state
          setIsValidEmail(validateEmail(userEmail));
        }}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {!isValidEmail && (
        <View
          style={{
            flexDirection: 'row', // To align the text to the left
            alignItems: 'center', // To vertically align the text with the input
          }}>
          <Text style={{color: 'red'}}>incorrect format of email</Text>
        </View>
      )}

      <FormInput
        labelValue={password}
        onChangeText={userPassword => {
          setPassword(userPassword);
          setIsValidPassword(validatePassword(password));
        }}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormInput
        labelValue={confirmPassword}
        onChangeText={userPassword => {
          setConfirmPassword(userPassword);
          setIsValidPassword(validatePassword(password));
        }}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
      />

      <FormButton buttonTitle="Sign Up" onPress={() => handleRegister()} />

      <View style={styles.textPrivate}>
        <Text style={styles.color_textPrivate}>
          By registering, you confirm that you accept our{' '}
        </Text>
        <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
          <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
            Terms of service
          </Text>
        </TouchableOpacity>
        <Text style={styles.color_textPrivate}> and </Text>
        <Text style={[styles.color_textPrivate, {color: '#e88832'}]}>
          Privacy Policy
        </Text>
      </View>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.navButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
});
