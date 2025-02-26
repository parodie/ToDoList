// components/CustomButton.js
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../colors';

const CustomButton = ({ title, textColor, iconName, onPress, backgroundColor, iconColor, style }) => {
  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor: backgroundColor || colors.black },
        style
          ]}
      onPress={onPress}
    >
       {iconName ? (
        <Ionicons name={iconName} size={20} color={iconColor || '#fff'} />
      ) : (
        <Text style={[styles.buttonText, { color: textColor || '#fff' }]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  
  
});

export default CustomButton;
