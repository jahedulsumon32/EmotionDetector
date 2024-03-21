import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {useQuery, gql} from '@apollo/client';

const COUNTRY_QUERY = gql`
  query CountryQuery {
    countries {
      name
      capital
      emoji
      code
      currency
      continent {
        name
      }
    }
  }
`;

export default function Home() {
  const {data, loading} = useQuery(COUNTRY_QUERY);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  //   useEffect(() => {
  //     console.log('GraphQL ===', data);
  //   }, [data]);

  const toggleModal1 = () => {
    setModalVisible1(!modalVisible1);
  };

  const toggleModal2 = () => {
    setModalVisible2(!modalVisible2);
  };

  const newtoggle = () => {
    setModalVisible1(!modalVisible1);
    setModalVisible2(!modalVisible2);
  };

  const handleCountryPress = country => {
    setSelectedCountry(country);
    newtoggle();
  };

  const renderCountryItem = ({item}) => (
    <TouchableOpacity
      style={styles.countryContainer}
      onPress={() => handleCountryPress(item)}>
      <Text style={styles.countryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GraphQL</Text>
      <TouchableOpacity style={styles.button} onPress={toggleModal1}>
        <Text style={styles.buttonText}>View All Countries</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible1} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={data?.countries}
              renderItem={renderCountryItem}
              keyExtractor={item => item.code}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => toggleModal1()}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {selectedCountry && (
        <Modal visible={modalVisible2} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.new}>Country: {selectedCountry.name}</Text>
              <Text style={styles.new}>Code: {selectedCountry.code}</Text>
              <Text style={styles.new}>Capital: {selectedCountry.capital}</Text>
              <Text style={styles.new}>Emoji: {selectedCountry.emoji}</Text>
              <Text style={styles.new}>
                Currency: {selectedCountry.currency}
              </Text>
              <Text style={styles.new}>
                Continent: {selectedCountry.continent.name}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => toggleModal2()}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  new: {
    color: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 38,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    maxHeight: '100%',
  },
  countryContainer: {
    backgroundColor: '#7fffd4',
    marginBottom: 10,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryName: {
    color: 'black',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
