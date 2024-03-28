import React, {useContext, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [isValidEmail, setIsValidEmail] = useState(true); // State to track email validity
  const [isValidPassword, setIsValidPassword] = useState(true); // State to track password validity
  const [usernameAvailable, setUsernameAvailable] = useState();
  const [allUsernames, setAllUsernames] = useState([]);

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

    if (usernameAvailable !== true) {
      Alert.alert(
        'Username unavailable',
        'Please choose a different username.',
      );
      return;
    }

    if (username === '') {
      Alert.alert(
        'Username cannot be empty. If not empty, this username is yours.',
      );
      return;
    }

    register(email, password, username);
  };

  const getUsernames = async () => {
    try {
      const querySnapshot = await firestore().collection('users').get();

      // Store usernames in the state
      const usernames = querySnapshot.docs.map(doc => doc.data().username);
      setAllUsernames(usernames);
      console.log(usernames);
    } catch (error) {
      console.error('Error checking username availability: ', error);
    }
  };

  const handleUsernameChange = text => {
    const trimmedUsername = text.trim(); // Trim the username to remove leading and trailing spaces
    setUserName(trimmedUsername); // Set the trimmed username in the state
    // Check if the entered username is available (case-insensitive comparison)
    setUsernameAvailable(!allUsernames.includes(trimmedUsername.toLowerCase()));
  };

  useEffect(() => {
    getUsernames();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an account</Text>

      <FormInput
        labelValue={username}
        onChangeText={handleUsernameChange}
        placeholderText="Username"
        iconType="user"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {usernameAvailable === false && (
        <Text style={styles.errorText}>Username not available</Text>
      )}

      {usernameAvailable === true && (
        <Text style={styles.availableText}>Username available</Text>
      )}

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
        <Text style={styles.errorText}>incorrect format of email</Text>
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
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
  },
  availableText: {
    color: 'green',
    alignSelf: 'flex-start',
  },
});
