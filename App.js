import 'react-native-gesture-handler';
import React from 'react';
import Providers from './navigation';
import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com/graphql',
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Providers />
    </ApolloProvider>
  );
};
export default App;
