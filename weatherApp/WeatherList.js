import React from 'react';
import { FlatList, ActivityIndicator, Text, View, StyleSheet  } from 'react-native';
import WeatherRow from './WeatherRow';

export default class WeatherList extends React.Component {

  constructor(props) {
    super(props);
    this.state ={ isLoading: true}
  }

  /**
  * Downloads the current weather from our local API. 
  */
  componentDidMount() {

    // query our API for the latest wether update for the given city 
    fetch(global.API_URL + '/get_weather?city_id=' + global.CITY_ID)
      .then((response) => response.json())
      .then((responseJson) => {

        this.prepData(responseJson)

      })
      .catch((error) =>{
        console.warn('api error', error);
      });

  }

  /**
  * the data is returned from the api as an array, sorted by date.
  * In order to handle it correctly via the custom WeatherRow component,
  * this function arranges the data into a new array for each new date
  * e.g. initial data could have [{3AM Monday}, {6AM Monday}, {3AM Tuesday}]
  * this function would create [[{3AM Monday}, {6AM Monday}], [{3AM Tuesday}]]
  */
  prepData(weatherData) {
    
    let prepped = [];
    let currRow = [];

    // react js needs the date as DD/MM/YYYY but DD-MM-YYYY is returned from api
    let d = new Date(Date.parse(weatherData[0].dt_txt.replace(/-/g, '/')));
    let currentDate = d.getDate();
    
    for(var i = 0; i < weatherData.length; i++) {

      d = new Date(Date.parse(weatherData[i].dt_txt.replace(/-/g, '/')));
      // keep a refernce to this date obj to save us converting it again
      weatherData[i].jsDate = d;
      // the dates are different
      if(d.getDate() != currentDate) {
        // add the current row array
        prepped.push(currRow);
        // reset it
        currRow = [];
        // update the new rows date
        currentDate = d.getDate();
      }

      // add this weather update to the current dates row
      currRow.push(weatherData[i]);
    }

    // dont forget the final row
    if(currRow.length > 0)
      prepped.push(currRow);
   
    this.setState({
          isLoading: false,
          dataSource: prepped,
        });
  }

  renderRow({item, index}) {

    return ( <View>
      <Text style={styles.dateHeading}>{item.length > 0 ? item[0].jsDate.toDateString() : ''}</Text>
      <WeatherRow weatherRow={item} />
      </View>)
  }

  render() {

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 50}}>
          <ActivityIndicator size="large"/>
        </View>
      )
    }

    return(
      <View style={{flex: 1, paddingTop: 20, paddingBottom: 50, marginLeft: 20}}>
        <FlatList
          data={this.state.dataSource}
          renderItem={this.renderRow}
          keyExtractor={(item, index) => 'row' + index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateHeading: {
    fontSize: 20, 
    textAlign: 'center',
    fontWeight: '700'
  }
});