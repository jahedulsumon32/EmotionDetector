import React, {useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import an icon from the library

const CustomCheckbox = ({label, isChecked, onChange}) => {
  return (
    <TouchableOpacity onPress={() => onChange(!isChecked)}>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkbox}>
          {isChecked ? (
            <Icon name="check-square" size={24} color="green" /> // Checked icon
          ) : (
            <Icon name="square-o" size={24} color="black" /> // Unchecked icon
          )}
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
  },
});

export default CustomCheckbox;
