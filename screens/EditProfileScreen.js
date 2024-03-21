import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
  Button,
  Platform,
  Modal,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

import {AuthContext} from '../navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {ScrollView, GestureHandlerRootView} from 'react-native-gesture-handler';

const EditProfileScreen = () => {
  const {user, logout} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [userData, setUserData] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [userName, setUserName] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); // State to manage visibility of date picker
  // const [selectedDivision, setSelectedDivision] = useState('');
  //const [selectedCity, setSelectedCity] = useState('');
  //const [cityOptions, setCityOptions] = useState([]);

  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  // State to manage the visibility of the modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const BASE_URL = 'https://api.countrystatecity.in/v1';
    const config = {
      method: 'get',
      url: `${BASE_URL}/countries`,
      headers: {
        'X-CSCAPI-KEY':
          'V2ZNbURQZ09ETDdORnk3eHduNm41YkpWbGV6WE9IdVNqVFl1Vjlrbg==',
      },
    };

    axios(config)
      .then(response => {
        const countries = response.data.map(country => ({
          value: country.iso2,
          label: country.name,
        }));
        setCountryData(countries);
        console.log(countries);
      })
      .catch(error => {
        console.log('Error fetching countries:', error);
      });
  }, []);

  const handleState = countryCode => {
    const BASE_URL = 'https://api.countrystatecity.in/v1';
    const config = {
      method: 'get',
      url: `${BASE_URL}/countries/${countryCode}/states`,
      headers: {
        'X-CSCAPI-KEY':
          'V2ZNbURQZ09ETDdORnk3eHduNm41YkpWbGV6WE9IdVNqVFl1Vjlrbg==',
      },
    };

    axios(config)
      .then(response => {
        const states = response.data.map(state => ({
          value: state.iso2,
          label: state.name,
        }));
        setStateData(states);
      })
      .catch(error => {
        console.log('Error fetching states:', error);
      });
  };

  const handleCity = (countryCode, stateCode) => {
    const BASE_URL = 'https://api.countrystatecity.in/v1';
    const config = {
      method: 'get',
      url: `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`,
      headers: {
        'X-CSCAPI-KEY':
          'V2ZNbURQZ09ETDdORnk3eHduNm41YkpWbGV6WE9IdVNqVFl1Vjlrbg==',
      },
    };

    axios(config)
      .then(response => {
        const cities = response.data.map(city => ({
          value: city.id,
          label: city.name,
        }));
        setCityData(cities);
      })
      .catch(error => {
        console.log('Error fetching cities:', error);
      });
  };

  // const handleDivisionChange = division => {
  //   setSelectedDivision(division);
  //   let cities = [];
  //   switch (division) {
  //     case 'Dhaka':
  //       cities = [
  //         'Dhaka',
  //         'Gazipur',
  //         'Narayanganj',
  //         'Tongi',
  //         'Savar',
  //         'Dhamrai',
  //         'Keraniganj',
  //         'Narsingdi',
  //         'Tangail',
  //         'Mymensingh',
  //         'Jamalpur',
  //         'Kishoreganj',
  //         'Manikganj',
  //       ];
  //       break;
  //     case 'Chittagong':
  //       cities = [
  //         'Chittagong',
  //         "Cox's Bazar",
  //         'Feni',
  //         'Rangamati',
  //         'Bandarban',
  //         'Khagrachhari',
  //         'Comilla',
  //         'Chandpur',
  //         'Lakshmipur',
  //         'Noakhali',
  //         'Brahmanbaria',
  //       ];
  //       break;
  //     case 'Rajshahi':
  //       cities = [
  //         'Rajshahi',
  //         'Bogra',
  //         'Pabna',
  //         'Naogaon',
  //         'Joypurhat',
  //         'Sirajganj',
  //         'Natore',
  //         'Chapai Nawabganj',
  //       ];
  //       break;
  //     case 'Khulna':
  //       cities = ['Khulna', 'Jessore'];
  //       break;
  //     case 'Barishal':
  //       cities = [
  //         'Barishal',
  //         'Bhola',
  //         'Jhalokati',
  //         'Patuakhali',
  //         'Pirojpur',
  //         'Barguna',
  //       ];
  //       break;
  //     case 'Sylhet':
  //       cities = ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'];
  //       break;
  //     case 'Rangpur':
  //       cities = [
  //         'Rangpur',
  //         'Dinajpur',
  //         'Gaibandha',
  //         'Kurigram',
  //         'Nilphamari',
  //         'Lalmonirhat',
  //         'Thakurgaon',
  //         'Panchagarh',
  //       ];
  //       break;
  //     case 'Mymensingh':
  //       cities = ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'];
  //       break;
  //     default:
  //       cities = [];
  //   }
  //   setCityOptions(cities);
  //   setSelectedCity('');
  // };

  const handleUsernameChange = async () => {
    if (userName === '') {
      Alert.alert(
        'Username cannot be empty. If not empty, this username is yours.',
      );
      return;
    }

    const trimmedUsername = userName.trim(); // Trim the username to remove leading and trailing spaces

    try {
      const querySnapshot = await firestore()
        .collection('users')
        .where('username', '==', trimmedUsername)
        .get();

      if (querySnapshot.empty) {
        // Username is available
        setIsUsernameAvailable(true);
        Alert.alert('Username is available');
      } else {
        // Username is not available
        setIsUsernameAvailable(false);
        Alert.alert('Username is not available');
        getUser();
      }
    } catch (error) {
      console.error('Error checking username availability: ', error);
    }
  };

  // const isUsernameUnique = async username1 => {
  //   try {
  //     const nameDocs = await usersColRef
  //       .where('username', '==', username1)
  //       .get();
  //     if (nameDocs.empty) return true;
  //     else return false;
  //   } catch (error) {
  //     console.error('Error checking username uniqueness:', error);
  //     throw error;
  //   }
  // };

  // const handleUsernameChange = () => {
  //   try {
  //     const isUnique = isUsernameUnique(userName.trim());
  //     setIsUsernameAvailable(isUnique);
  //     if (!isUnique) {
  //       Alert.alert('Username is not available');
  //     }
  //   } catch (error) {
  //     console.error('Error checking username availability: ', error);
  //     Alert.alert('An error occurred while checking username availability');
  //   }
  // };

  const getUser = async () => {
    const currentUser = await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data());
          setSelectedCountry(documentSnapshot.data().country);
          setSelectedState(documentSnapshot.data().state);
          setSelectedCity(documentSnapshot.data().city);
          // Initialize dateOfBirth from Firestore if available or set it to the current date
          // Initialize dateOfBirth from Firestore if available or set it to the current date
          const dob = documentSnapshot.data().dateofbirth;
          if (dob) {
            setDateOfBirth(new Date(dob.seconds * 1000)); // Convert Firestore timestamp to Date
          } else {
            setDateOfBirth(new Date()); // Set to current date if dateofbirth is not present
          }
        }
      })
      .catch(error => {
        console.error('Error getting user details: ', error);
      });
  };

  // const handleUpdate = async () => {
  //   let imgUrl = await uploadImage();

  //   if (imgUrl == null && userData.userImg) {
  //     imgUrl = userData.userImg;
  //   }

  //   firestore()
  //     .collection('users')
  //     .doc(user.uid)
  //     .update({
  //       username: userData.username,
  //       fname: userData.fname,
  //       lname: userData.lname,
  //       about: userData.about,
  //       phone: userData.phone,
  //       country: userData.country,
  //       city: userData.city,
  //       userImg: imgUrl,
  //     })
  //     .then(() => {
  //       console.log('User Updated!');
  //       getUser();
  //       Alert.alert(
  //         'Profile Updated!',
  //         'Your profile has been updated successfully.',
  //       );
  //     })
  //     .catch(error => {
  //       console.error('Error updating user details: ', error);
  //     });
  // };

  const handleUpdate = async () => {
    let imgUrl = await uploadImage();

    if (imgUrl == null && userData.userImg) {
      imgUrl = userData.userImg;
    }

    // Construct an object containing only the defined fields
    const updateData = {
      userImg: imgUrl,
    };

    // Add other fields if they are defined
    if (userData.username) updateData.username = userData.username;
    if (userData.fname) updateData.fname = userData.fname;
    if (userData.lname) updateData.lname = userData.lname;
    if (userData.about) updateData.about = userData.about;
    if (userData.phone) updateData.phone = userData.phone;
    updateData.dateofbirth = dateOfBirth;
    updateData.country = selectedCountry;
    updateData.state = selectedState;
    updateData.city = selectedCity;

    await firestore()
      .collection('users')
      .doc(user.uid)
      .update(updateData)
      .then(() => {
        console.log('User Updated!');
        getUser();
        Alert.alert(
          'Profile Updated!',
          'Your profile has been updated successfully.',
        );
      })
      .catch(error => {
        console.error('Error updating user details: ', error);
      });
  };

  const uploadImage = async () => {
    if (image == null) {
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);

    // Set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );

      setTransferred(
        Math.round(
          (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100,
        ),
      );
    });

    try {
      await task;

      const url = await storageRef.getDownloadURL();

      setUploading(false);
      setImage(null);

      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
        setShowModal(false);
      })
      .catch(error => {
        console.log('User cancelled image selection');
        // Handle the error or do nothing if you just want to log it
      });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        console.log(image);
        const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        setImage(imageUri);
        setShowModal(false);
      })
      .catch(error => {
        console.log('User cancelled image selection');
        // Handle the error or do nothing if you just want to log it
      });
  };

  return (
    <GestureHandlerRootView>
      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={{alignItems: 'center'}}>
            <View style={styles.imageContainer}>
              <ImageBackground
                source={{
                  uri: image
                    ? image
                    : userData
                    ? userData.userImg ||
                      'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                    : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                }}
                style={styles.image}
                imageStyle={{borderRadius: 15}}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={35}
                    color="#fff"
                    style={{
                      opacity: 0.7,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: '#fff',
                      borderRadius: 10,
                    }}
                  />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>

          {/* modal for imagw selection */}
          {showModal && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={showModal}
              onRequestClose={() => setShowModal(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.buttonContainer}>
                    <Button
                      title="Take Photo"
                      onPress={takePhotoFromCamera}
                      color="#8a2be2"
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      title="Choose From Library"
                      onPress={choosePhotoFromLibrary}
                      color="#8a2be2"
                    />
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button
                      title="Cancel"
                      onPress={() => setShowModal(false)}
                      color="#8a2be2"
                    />
                  </View>
                </View>
              </View>
            </Modal>
          )}

          <Text
            style={{
              marginTop: 5,
              fontSize: 30,
              fontWeight: 'bold',
              textAlign: 'center',
              color: 'black',
            }}>
            {userData ? userData.fname : ''} {userData ? userData.lname : ''}
          </Text>

          <View style={styles.action}>
            <FontAwesome name="user" color="#333333" size={20} />
            <TextInput
              placeholder="Enter a username"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={userData ? userData.username : ''}
              onChangeText={txt => {
                setUserData({...userData, username: txt});
                setUserName(txt);
              }}
              style={styles.textInput}
            />
          </View>
          <TouchableOpacity
            style={styles.updateUsernameButton}
            onPress={() => {
              handleUsernameChange();
            }}>
            <Text style={styles.updateButtonText}>Username Available?</Text>
          </TouchableOpacity>

          <View style={styles.action}>
            <FontAwesome name="user-o" color="#333333" size={20} />
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={userData ? userData.fname : ''}
              onChangeText={txt => setUserData({...userData, fname: txt})}
              style={styles.textInput}
            />
          </View>

          <View style={styles.action}>
            <FontAwesome name="user-o" color="#333333" size={20} />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#666666"
              value={userData ? userData.lname : ''}
              onChangeText={txt => setUserData({...userData, lname: txt})}
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={styles.action}>
            <Ionicons name="clipboard-outline" color="#333333" size={20} />
            <TextInput
              multiline
              numberOfLines={3}
              placeholder="About Me"
              placeholderTextColor="#666666"
              value={userData ? userData.about : ''}
              onChangeText={txt => setUserData({...userData, about: txt})}
              autoCorrect={true}
              style={[styles.textInput, {height: 40}]}
            />
          </View>
          <View style={styles.action}>
            <Feather name="phone" color="#333333" size={20} />
            <TextInput
              placeholder="Phone"
              placeholderTextColor="#666666"
              keyboardType="number-pad"
              autoCorrect={false}
              value={userData ? userData.phone : ''}
              onChangeText={txt => setUserData({...userData, phone: txt})}
              style={styles.textInput}
            />
          </View>

          {/* <View style={styles.action}>
            <FontAwesome name="globe" color="#333333" size={20} />
            <TextInput
              placeholder="Country"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={userData ? userData.country : ''}
              onChangeText={txt => setUserData({...userData, country: txt})}
              style={styles.textInput}
            />
          </View> */}
          {/* <View style={styles.action}>
            <MaterialCommunityIcons
              name="map-marker-outline"
              color="#333333"
              size={20}
            />
            <TextInput
              placeholder="City"
              placeholderTextColor="#666666"
              autoCorrect={false}
              value={userData ? userData.city : ''}
              onChangeText={txt => setUserData({...userData, city: txt})}
              style={styles.textInput}
            />
          </View> */}

          {/* Multiple Drop Down Button*/}
          {/* <View>
            <MaterialCommunityIcons
              name="map-marker-outline"
              color="#333333"
              size={20}
            />
            <RNPickerSelect
              placeholder={{label: 'Select Division', value: null}}
              items={[
                {label: 'Dhaka', value: 'Dhaka'},
                {label: 'Chittagong', value: 'Chittagong'},
                {label: 'Rajshahi', value: 'Rajshahi'},
                {label: 'Khulna', value: 'Khulna'},
                {label: 'Barishal', value: 'Barishal'},
                {label: 'Sylhet', value: 'Sylhet'},
                {label: 'Rangpur', value: 'Rangpur'},
                {label: 'Mymensingh', value: 'Mymensingh'},
              ]}
              value={selectedDivision}
              onValueChange={value => handleDivisionChange(value)}
              style={{
                inputIOS: styles.textInput,
                inputAndroid: styles.textInput,
              }}
            />
          </View>
          <View>
            <MaterialCommunityIcons
              name="map-marker-outline"
              color="#333333"
              size={20}
            />
            <RNPickerSelect
              placeholder={{label: 'Select City', value: null}}
              items={cityOptions.map(city => ({label: city, value: city}))}
              value={selectedCity}
              onValueChange={value => setSelectedCity(value)}
              style={{
                inputIOS: styles.textInput,
                inputAndroid: styles.textInput,
              }}
            />
          </View> */}
          <View>
            <FontAwesome name="globe" color="#333333" size={20} />
            <RNPickerSelect
              placeholder={{label: 'Select Country', value: null}}
              items={countryData}
              value={selectedCountry}
              onValueChange={value => {
                setSelectedCountry(value);
                handleState(value);
              }}
              style={styles.textInput}
            />
          </View>

          <View>
            <MaterialCommunityIcons
              name="map-marker-outline"
              color="#333333"
              size={20}
            />
            <RNPickerSelect
              placeholder={{label: 'Select State', value: null}}
              items={stateData}
              value={selectedState}
              onValueChange={value => {
                setSelectedState(value);
                handleCity(selectedCountry, value);
              }}
              style={styles.textInput}
            />
          </View>

          <View>
            <MaterialCommunityIcons
              name="map-marker-outline"
              color="#333333"
              size={20}
            />
            <RNPickerSelect
              placeholder={{label: 'Select City', value: null}}
              items={cityData}
              value={selectedCity}
              onValueChange={value => setSelectedCity(value)}
              style={styles.textInput}
            />
          </View>

          <View>
            {/* Date of Birth Picker */}
            <TouchableOpacity
              style={styles.action}
              onPress={() => setShowDatePicker(true)}>
              <MaterialCommunityIcons
                name="calendar"
                color="#333333"
                size={20}
              />
              <Text style={styles.dateText}>
                <Text>Date Of Birth: </Text>
                {dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>

            {/* Show DateTimePicker if showDatePicker is true */}
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || dateOfBirth;
                  setShowDatePicker(Platform.OS === 'ios'); // Hide the picker on iOS
                  setDateOfBirth(currentDate);
                }}
              />
            )}
          </View>

          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => {
              handleUpdate();
            }}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    width: '100%',
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
    fontWeight: 'bold',
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#2e64e5',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    marginBottom: 10,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  dateText: {
    flex: 1,
    marginLeft: 10,
    color: '#333333',
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#333333',
  },
  textInputUsername: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 0,
    paddingLeft: 10,
    color: '#333333',
  },
  imageContainer: {
    height: 160,
    width: 160,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    height: 150,
    width: 150,
  },
  cameraIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButton: {
    backgroundColor: '#8a2be2',
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  updateUsernameButton: {
    backgroundColor: '#8a2be2',
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 60,
  },
  // New styles for overlay and overlay buttons
  overlay: {
    position: 'absolute',
    top: '100%', // Position the overlay below the dropdown
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 1, // Ensure the overlay is above other elements
  },
  overlayButton: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  overlayButtonText: {
    color: '#333',
    fontSize: 16,
  },
});
