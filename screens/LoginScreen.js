import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [isValidEmail, setIsValidEmail] = useState(true); // State to track email validity
  const [isValidPassword, setIsValidPassword] = useState(true); // State to track password validity
  const {login, googleLogin, phoneLogin} = useContext(AuthContext);

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

  const handleLogin = () => {
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
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/logo4.png')} style={styles.logo} />
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

      <FormButton buttonTitle="Sign In" onPress={() => handleLogin()} />

      <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
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
});
