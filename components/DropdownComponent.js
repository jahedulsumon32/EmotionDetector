import React, {useEffect, useState} from 'react';
import {
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';

const DropdownComponentScreen = () => {
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [stateName, setStateName] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const BASE_URL = 'https://api.countrystatecity.in/v1';

  useEffect(() => {
    var config = {
      method: 'get',
      url: `${BASE_URL}/countries`,
      headers: {
        'X-CSCAPI-KEY':
          'V2ZNbURQZ09ETDdORnk3eHduNm41YkpWbGV6WE9IdVNqVFl1Vjlrbg==',
      },
    };

    axios(config)
      .then(response => {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let countryArray = [];
        for (var i = 0; i < count; i++) {
          countryArray.push({
            value: response.data[i].iso2,
            label: response.data[i].name,
          });
        }
        setCountryData(countryArray);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleState = countryCode => {
    var config = {
      method: 'get',
      url: `${BASE_URL}/countries/${countryCode}/states`,
      headers: {
        'X-CSCAPI-KEY':
          'V2ZNbURQZ09ETDdORnk3eHduNm41YkpWbGV6WE9IdVNqVFl1Vjlrbg==',
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let stateArray = [];
        for (var i = 0; i < count; i++) {
          stateArray.push({
            value: response.data[i].iso2,
            label: response.data[i].name,
          });
        }
        setStateData(stateArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleCity = (countryCode, stateCode) => {
    var config = {
      method: 'get',
      url: `${BASE_URL}/countries/${countryCode}/states/${stateCode}/cities`,
      headers: {
        'X-CSCAPI-KEY':
          'V2ZNbURQZ09ETDdORnk3eHduNm41YkpWbGV6WE9IdVNqVFl1Vjlrbg==',
      },
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        var count = Object.keys(response.data).length;
        let cityArray = [];
        for (var i = 0; i < count; i++) {
          cityArray.push({
            value: response.data[i].id,
            label: response.data[i].name,
          });
        }
        setCityData(cityArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 15}}>
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          // placeholderStyle={styles.placeholderStyle}
          // selectedTextStyle={styles.selectedTextStyle}
          // inputSearchStyle={styles.inputSearchStyle}
          // iconStyle={styles.iconStyle}
          data={countryData}
          // search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select country' : '...'}
          searchPlaceholder="Search..."
          value={country}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCountry(item.value);
            handleState(item.value);
            setCountryName(item.label);
            setIsFocus(false);
          }}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          // placeholderStyle={styles.placeholderStyle}
          // selectedTextStyle={styles.selectedTextStyle}
          // inputSearchStyle={styles.inputSearchStyle}
          // iconStyle={styles.iconStyle}
          data={stateData}
          //search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select state' : '...'}
          searchPlaceholder="Search..."
          value={state}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setState(item.value);
            handleCity(country, item.value);
            setStateName(item.label);
            setIsFocus(false);
          }}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          // placeholderStyle={styles.placeholderStyle}
          // selectedTextStyle={styles.selectedTextStyle}
          // inputSearchStyle={styles.inputSearchStyle}
          // iconStyle={styles.iconStyle}
          data={cityData}
          //search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select city' : '...'}
          searchPlaceholder="Search..."
          value={city}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCity(item.value);
            setCityName(item.label);
            setIsFocus(false);
          }}
        />
      </View>
    </View>
  );
};

export default DropdownComponentScreen;

const styles = StyleSheet.create({
  dropdown: {
    marginBottom: 10,
  },
});
