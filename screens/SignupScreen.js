import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';
import {Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState();
  const [allUsernames, setAllUsernames] = useState([]);
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  const {register} = useContext(AuthContext);

  const validateEmail = email => {
    // Trim the email input to avoid false negatives due to leading/trailing spaces
    const trimmedEmail = email.trim();

    // Basic regex to validate the general structure of an email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

    // Test against the regex for the correct format and domain
    return emailRegex.test(trimmedEmail);
  };

  const validatePassword = password => {
    return password && password.length > 0;
  };

  const handleRegister = async () => {
    // Validate email
    if (!validateEmail(email)) {
      setIsValidEmail(false);
      Alert.alert('Invalid Email', 'Email must end with @gmail.com');
      return;
    }

    // Check if the email already exists in the database
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      Alert.alert(
        'Email already exists',
        'Please use a different email address.',
      );
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setIsValidPassword(false);
      Alert.alert('Error', 'Password cannot be empty');
      return;
    }

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
      Alert.alert('Error', 'Username cannot be empty.');
      return;
    }

    // If all validations pass, register the user
    register(email, password, username);
  };

  // Function to check if email already exists in Firestore
  const checkEmailExists = async email => {
    try {
      const querySnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();
      return !querySnapshot.empty; // Returns true if email exists
    } catch (error) {
      console.error('Error checking email existence: ', error);
      return false; // If an error occurs, assume the email does not exist
    }
  };

  const getUsernames = async () => {
    try {
      const querySnapshot = await firestore().collection('users').get();
      const usernames = querySnapshot.docs.map(doc => doc.data().username);
      setAllUsernames(usernames);
    } catch (error) {
      console.error('Error checking username availability: ', error);
    }
  };

  const handleUsernameChange = text => {
    const trimmedUsername = text.trim();
    setUserName(trimmedUsername);
    if (trimmedUsername.length >= 3) {
      setUsernameAvailable(
        !allUsernames.includes(trimmedUsername.toLowerCase()),
      );
    } else {
      setUsernameAvailable(undefined);
    }
    setIsUsernameValid(trimmedUsername.length >= 3);
  };

  useEffect(() => {
    getUsernames();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>Create an account</Text>
        <FormInput
          labelValue={username}
          onChangeText={handleUsernameChange}
          placeholderText="Username"
          iconType="user"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {!isUsernameValid && (
          <Text style={styles.errorText}>
            Username must be at least 3 characters long
          </Text>
        )}
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
            const isValid = validateEmail(userEmail);
            setIsValidEmail(isValid);
          }}
          placeholderText="Email"
          iconType="user"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {!isValidEmail && (
          <Text style={styles.errorText}>Invalid email format</Text>
        )}

        <FormInput
          labelValue={password}
          onChangeText={userPassword => {
            setPassword(userPassword);
            setIsValidPassword(validatePassword(userPassword));
          }}
          placeholderText="Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormInput
          labelValue={confirmPassword}
          onChangeText={userPassword => {
            setConfirmPassword(userPassword);
            setIsValidPassword(validatePassword(userPassword));
          }}
          placeholderText="Confirm Password"
          iconType="lock"
          secureTextEntry={true}
        />

        <FormButton buttonTitle="Sign Up" onPress={handleRegister} />

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
    </ScrollView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  scrollViewContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
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
