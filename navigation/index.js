import React from 'react';
import {AuthProvider} from './AuthProvider';
import Routes from './Routes';

const Providers = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default Providers;

// In summary, this code sets up a user authentication system using Firebase in a React Native application.
//  AuthProvider manages the authentication state and provides authentication methods,
//  while Routes controls the navigation flow based on the authentication state. Providers acts as
//  the top-level component that wraps the entire application and provides the authentication context to all components.
