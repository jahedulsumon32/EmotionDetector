import React, {createContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import firestore from '@react-native-firebase/firestore';
import {Alert} from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            const response = await auth().signInWithEmailAndPassword(
              email,
              password,
            );
          } catch (e) {
            Alert.alert('Please Insert Correct Email and Password');
            console.log(e);
          }
        },
        googleLogin: async () => {
          try {
            // Get the users ID token
            const {idToken} = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            await auth()
              .signInWithCredential(googleCredential)
              // Use it only when user Sign's up,
              // so create different social signup function
              // .then(() => {
              //   //Once the user creation has happened successfully, we can add the currentUser into firestore
              //   //with the appropriate details.
              //   // console.log('current User', auth().currentUser);
              //   firestore().collection('users').doc(auth().currentUser.uid)
              //   .set({
              //       fname: '',
              //       lname: '',
              //       email: auth().currentUser.email,
              //       createdAt: firestore.Timestamp.fromDate(new Date()),
              //       userImg: null,
              //   })
              //   //ensure we catch any errors at this stage to advise us if something does go wrong
              //   .catch(error => {
              //       console.log('Something went wrong with added user to firestore: ', error);
              //   })
              // })
              //we need to catch the whole sign up process if it fails too.
              .catch(error => {
                console.log('Something went wrong with sign up: ', error);
              });
          } catch (error) {
            console.log({error});
          }
        },

        register: async (email, password, username) => {
          try {
            const userCredential = await auth().createUserWithEmailAndPassword(
              email,
              password,
            );

            //Once the user creation has happened successfully
            const user = userCredential.user;

            // Send email verification
            await user.sendEmailVerification();

            // Show success message to the user
            Alert.alert('Registration Successful', 'Please verify your email.');

            // Add the user to firestore
            await firestore()
              .collection('users')
              .doc(user.uid)
              .set({
                fname: '',
                lname: '',
                email: email,
                createdAt: firestore.Timestamp.fromDate(new Date()),
                userImg: null,
                username: username,
              });
          } catch (error) {
            // Handle error during registration
            if (error.code === 'auth/email-already-in-use') {
              Alert.alert(
                'Error',
                'The email address is already in use by another account.',
              );
            } else if (error.code === 'auth/weak-password') {
              Alert.alert(
                'Error',
                'The password is invalid. Password should be at least 6 characters.',
              );
            } else {
              Alert.alert('Error', 'Something went wrong with sign up.');
            }
            console.log('Something went wrong with sign up: ', error);
          }
        },

        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.log(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// In summary, <AuthContext.Provider> serves as the provider component for the AuthContext
//  context, allowing
//  its child components to access authentication-related state and functions provided by the AuthProvider.
