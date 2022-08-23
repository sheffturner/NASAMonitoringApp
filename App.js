import React, {useState, useEffect} from "react";
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import moment from "moment";
import Header from './components/Header.js';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const App = () => {
  const currentDate = new Date();
  const [slideActive, setSlideActive] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [queryDate, setQueryDate] = useState("");
  const [data, setData] = useState([]);
  
  // Set params for NSAURL
  const nasaUrlParams = new URLSearchParams({
    start_date: queryDate,
    end_date: queryDate,
    api_key: '2zcSAHeiiktxliyCHz2eVVzGfUpwPsFqTX97WquF'
  });

  // Calls NASA api via fetch api function
  useEffect(() => {
    fetch(`https://api.nasa.gov/neo/rest/v1/feed?${ nasaUrlParams.toString()}`)
    .then((response) => response.json())
    .then((json) => setData(Object.values(json.near_earth_objects)[0]))
    .catch((error) => console.error(error))
    .finally(() => setLoading(false))
  },[queryDate])


  // Sets the current slide on screen
  const onChange = (nativeEvent) =>{
    if (nativeEvent){
      const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
      if (slide != slideActive){
        setSlideActive(slide);
      }
    }
  }

  // Calculates the average Diameter in feet.
  const calcAvgDiamterInFeet = (maxDiameter, minDiameter) =>{
      return ((maxDiameter + minDiameter) / 2).toFixed(2);
  }

  const calcMissDistance = (missDistance) =>{
    return Number(missDistance).toFixed(2);
  }

  const calSpeed = (speed) =>{
    return Number(speed).toFixed(0);
  }

  // This function is called when the search button is pressed
  // It sets the query date which will be used to set the start and end dates in the URLParameter object.
  const searchForAsteroids = (text) => {
    // Validation - checks if date is inputted / date is valid.
    if (!text) {
      Alert.alert("Error", "Please enter a date", { text: "Ok" });
    } else if (!moment(text, "YYYY-MM-DD", true).isValid()) {
      Alert.alert("Error", "Please enter a valid date with format YYYY-MM-DD", {
        text: "Ok",
      });
    } else {
      setQueryDate(text);
    }
  };

  // Gets a list of Asterioids data from the API call and maps each to a View with Text components
  const listOfAsteroidsData = () =>{
    return data.map((e, index) => {
      return (
        <View key={e.id}>
          <View style={styles.wrapNasaInfo}>
            <View style={styles.textInfoWrapper}>
              <View style={styles.ViewItem}>
                <Text style={styles.textLabel}>NAME</Text>
              </View>
              <View style={styles.ViewItem}>
                <Text style={styles.textInfo}>{e.name}</Text>
              </View>
            </View>
            <View style={styles.textInfoWrapper}>
              <View style={styles.ViewItem}>
                <Text style={styles.textLabel}>DIAMETER (Feet)</Text>
              </View>
              <View style={styles.ViewItem}>
                <Text style={styles.textInfo}>{calcAvgDiamterInFeet(e.estimated_diameter.feet.estimated_diameter_max, e.estimated_diameter.feet.estimated_diameter_min)}</Text>
              </View>
            </View>
            <View style={styles.textInfoWrapper}>
              <View style={styles.ViewItem}>
                <Text style={styles.textLabel}>MISS DISTANCE (Miles)</Text>
              </View>
              <View style={styles.ViewItem}>
                <Text style={styles.textInfo}>{calcMissDistance(e.close_approach_data[0].miss_distance.miles)}</Text>
              </View>
            </View>
            <View style={styles.textInfoWrapper}>
              <View style={styles.ViewItem}>
                <Text style={styles.textLabel}>SPEED (MPH)</Text>
              </View>
              <View style={styles.ViewItem}>
                <Text style={styles.textInfo}>{calSpeed(e.close_approach_data[0].relative_velocity.miles_per_hour)}</Text>
              </View>
            </View>
            <View style={styles.textInfoWrapper}>
              <View style={styles.ViewItem}>
                <Text style={styles.textLabel}>THREAT LEVEL</Text>
              </View>
              <View style={styles.ViewItem}>
                <Text style={styles.textInfo}>{e.is_potentially_hazardous_asteroid == true ? "HAZARDOUS" : "NON HAZARDOUS"}</Text>
              </View>
            </View>
          </View>
        </View>
      )
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        style={styles.wrapHeader}
        searchForAsteroids={searchForAsteroids}
      />
      <View style={styles.wrapBody}>
        <ScrollView
          onScroll={({ nativeEvent }) => onChange(nativeEvent)}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          style={styles.wrapBody}
        >
          {listOfAsteroidsData()}
        </ScrollView>
        <View style={styles.wrapDot}>
          {data.map((e, index) => (
            <Text
              key={e.id}
              style={slideActive == index ? styles.dotActive : styles.dot}
            >
              ●
            </Text>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapNasaInfo: {
    flex: 1,
    backgroundColor: '#F3F2F9',
    textAlign: 'center',
    fontSize: 20,
    width: WIDTH,
    height: HEIGHT * 0.60,
  },
  wrapBody: {
    width: WIDTH,
    height: HEIGHT * 0.70,
    backgroundColor: '#F3F2F9',
  },
  wrapDot: {
    position: 'absolute',
    bottom: 55,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotActive : {
    margin: 3,
    color: '#555555',
    borderColor: '#555555',
  },
  dot: {
    margin: 3,
    color: 'white',
    borderColor: '#555555',
  },
  textInfoWrapper:{
    padding: 10,
    backgroundColor: '#FFFFFF',
    margin: 10,
    borderRadius: 10,
    height: HEIGHT * 0.09,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  textLabel:{
    fontWeight: '600',
  },
  textInfo: {
  },
  ViewItem:{
    alignSelf: 'center',
  }
});

export default App;
