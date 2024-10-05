import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  Alert,
  CheckBox,
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';
import CustomCheckbox from '../components/CustomCheckbox';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isValidEmail, setIsValidEmail] = useState(true); // State to track email validity
  const [isValidPassword, setIsValidPassword] = useState(true); // State to track password validity
  const {login, googleLogin, phoneLogin} = useContext(AuthContext); // Get isLoading and login function from AuthContext
  const [rememberMe, setRememberMe] = useState(false); // State to track "Remember Me" checkbox

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

  const handleLogin = async () => {
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
    login(email, password);
    if (rememberMe) {
      // If "Remember Me" is checked, store email and password in AsyncStorage
      try {
        await AsyncStorage.setItem(
          'userCredentials',
          JSON.stringify({email, password}),
        );
      } catch (error) {
        console.error('Error storing user credentials:', error);
      }
    }
  };

  const handleLogout = async () => {
    // Clear stored user credentials upon logout
    try {
      await AsyncStorage.removeItem('userCredentials');
    } catch (error) {
      console.error('Error clearing user credentials:', error);
    }
  };

  // Function to load user credentials from AsyncStorage and auto-login
  const autoLogin = async () => {
    try {
      const storedCredentials = await AsyncStorage.getItem('userCredentials');
      if (storedCredentials) {
        const {email: storedEmail, password: storedPassword} =
          JSON.parse(storedCredentials);
        setEmail(storedEmail);
        setPassword(storedPassword);
      }
    } catch (error) {
      console.error('Error auto-logging in:', error);
    }
  };

  // Auto-login when component mounts
  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/b1.png')} style={styles.logo} />
      <Text style={styles.text}>Emotion Detector</Text>

      <FormInput
        labelValue={email}
        onChangeText={userEmail => {
          setEmail(userEmail);
          // Validate email on each change and update isValidEmail state
          setIsValidEmail(validateEmail(userEmail));
        }}
        placeholderText="Enter Your Email"
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
        placeholderText="Enter Your Password"
        iconType="lock"
        secureTextEntry={true}
      />

      {/* "Remember Me" Checkbox */}
      <CustomCheckbox
        label="Remember Me"
        isChecked={rememberMe}
        onChange={value => setRememberMe(value)}
      />

      <FormButton buttonTitle="Sign In" onPress={() => handleLogin()} />

      <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <Text style={styles.navButtonText}>
          Sign in with other options below
        </Text>
      </TouchableOpacity>

      {Platform.OS === 'android' ? (
        <View>
          <SocialButton
            buttonTitle="Sign In with Google"
            btnType="google"
            color="#de4d41"
            backgroundColor="#f5e7ea"
            onPress={() => googleLogin()}
          />
          <SocialButton
            buttonTitle="Sign In with Phone"
            btnType="phone"
            color="#de4d41"
            backgroundColor="#f5e7ea"
            onPress={() => navigation.navigate('PhoneLogin')}
          />
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.navButtonText}>
          Don't have an acount? Create here
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
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
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
  },
});
