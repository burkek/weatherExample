import React from 'react';
import { FlatList, ActivityIndicator, Text, View, StyleSheet, Image } from 'react-native';

export default class WeatherList extends React.Component {

  constructor(props) {
    super(props);
    // update the state with the weather info passed from WeatherList
    this.state ={dataSource: this.props.weatherRow}
  }

  /**
  * create the single entry box for that hours weather update
  */
  renderBox({item, index}) {

    return (
      <View style={styles.rowContainer}>
        <View style={styles.boxHeading}>
          <Image 
          resizeMode={'contain'}
          style={styles.icon}
          source={{uri: 'http://openweathermap.org/img/wn/' + item.weather[0].icon + '@2x.png'}} 

          />
          <Text style={styles.boxHeadingText}>{item.jsDate.toLocaleTimeString('en-US', {'timeStyle': 'short'})}</Text>
        </View>
        <View style={styles.mainContent}>
          <Text style={styles.dataHeading}>Overview</Text>
          <Text style={styles.dataText}>{item.weather[0].main}</Text>

          <Text style={styles.dataHeading}>Details</Text>
          <Text style={styles.dataText}>{item.weather[0].description}</Text>

          <Text style={styles.dataHeading}>Temperature</Text>
          <Text style={styles.dataText}>{item.main.temp}</Text>

          <Text style={styles.dataHeading}>Humidity</Text>
          <Text style={styles.dataText}>{item.main.humidity}</Text>
        </View>
      </View>
      )
  }

  render() {

    return(
      <View style={{flex: 1, paddingTop:20}}>
        <FlatList
        horizontal={true}
          data={this.state.dataSource}
          renderItem={this.renderBox}
          keyExtractor={(item, index) => 'box' + index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  boxHeading: {
    backgroundColor: '#00B1B0', 
    height:  50, 
    justifyContent: 'center', 
    position: 'relative', 
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7
  },
  boxHeadingText: {
    fontSize: 18, 
    color: '#f5f4f4',
    textAlign: 'center', 
    fontWeight: '700', 
  },
  dataHeading: {
    fontSize: 15,
    marginBottom: 7, 
    marginTop: 15, 
    fontWeight: '700', 
  },
  mainContent: {
    paddingLeft: 20,
    paddingRight: 20, 
    paddingBottom: 20,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: '#f5f4f4'
  },
  rowContainer: {
    flex: 1,
    width: 200,
    backgroundColor: '#fff',
    marginRight: 20, 
    marginBottom: 35,
  },
  icon: {
    position: 'absolute',
    height:30, 
    width: 30, 
    left: 15
  }
});
