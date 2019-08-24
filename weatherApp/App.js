import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView
} from 'react-native';

import WeatherList from './WeatherList';

// vancouver city id for Open Weather API
global.CITY_ID = '6173331';
// special IP for your machine from a virtual device
global.API_URL = 'http://10.0.2.2:3000'; 
 
export default function App() {
  return (
    <ScrollView style={styles.container}>
    <View>
      <Text style={styles.heading}>Vancouver Weather Forecast</Text>
      <WeatherList />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 30,
    flex: 1, 
    justifyContent: 'center', 
    textAlign: 'center',
    backgroundColor: '#01A5D9',
    padding: 20, 
    paddingTop: 35, // 15 for the status bar on phones
    color: '#FFFFFF'
  }
});
