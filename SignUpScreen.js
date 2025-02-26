import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

const SignUpScreen = ({ navigation }) => {
  const [Fullname, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let loc = await Location.getCurrentPositionAsync({});
        setLatitude(loc.coords.latitude);
        setLongitude(loc.coords.longitude);
      } else {
        Alert.alert("Permission Denied", "Location access is required for signup.");
      }
    })();
  }, []);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
  
    // Fetch the latest location before signing up
    let loc;
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required for signup.");
        return;
      }
      loc = await Location.getCurrentPositionAsync({});
    } catch (error) {
      Alert.alert("Error", "Failed to retrieve location. Please try again.");
      return;
    }
  
    const { latitude, longitude } = loc.coords;
  
    // Log the gathered information to the terminal
    console.log("Collected Data:", {
      name: Fullname,
      email: email,
      password: password,
      phoneNo: phoneNo,
      latitude: latitude,
      longitude: longitude,
    });
  
    try {
      const response = await fetch('http://192.168.156.197:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: Fullname, email, password, phoneNo: phoneNumber, latitude, longitude }),
      });
      const data = await response.json();
  
      if (response.ok) {
        Alert.alert('Success', data.message);
        console.log("Sign up successful");
        navigation.navigate('Login');
      } else {
        Alert.alert('Sorry', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server');
    }
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f0f8ff', '#f0f8ff']} style={styles.backgroundGradient}>
        <Text style={styles.title}>Create Account</Text>
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Full Name" onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Phone Number" onChangeText={setPhoneNo} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
          <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry onChangeText={setConfirmPassword} />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <LinearGradient colors={['#1eaad1', '#1eaad1']} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: '#1eaad1',
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    marginBottom: 15,
    color: '#111111',
  },
  button: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
  },
});

export default SignUpScreen;
