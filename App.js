import React,{ useState,useEffect } from 'react';
import {StyleSheet, View, Text,Button, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

const App = () => {
  const [location,setLocation] = useState(false);
  const [currentlocation,setCurrentLocation] = useState(false);
 
// Function to get permission for location
const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    console.log('granted', granted);
    if (granted === 'granted') {
      console.log('You can use Geolocation');
      requestBackgroundLocationPermission();
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  } catch (err) {
    return false;
  }
};

const requestBackgroundLocationPermission = async () => {
  const backgroundgranted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    {
      title: 'Background Location Permission',
      message:
        'We need access to your location ' +
        'so you can get live quality updates.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
//request the permission before starting the service.

console.log('permission granted');

ReactNativeForegroundService.add_task(
  () => {
    // function to check permissions and get Location
getLocation();

  },
  {
    delay: 5000,
    onLoop: true,
    taskId: 'taskid',
    onError: (e) => console.log('Error logging:', e),
  },
);
} 
}

// function to check permissions and get Location
const getLocation = () => {
  const result = requestLocationPermission();
  result.then(res => {
    console.log('res is:', res);
    if (res) {
      Geolocation.watchPosition(
        position => {
          console.log(position);
          setLocation(position);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
          setLocation(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
      // 
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          setCurrentLocation(position);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
          setLocation(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  });
  console.log(location);
  console.log(currentlocation);
};

useEffect( ()=>{
  requestBackgroundLocationPermission();
  requestLocationPermission();
},[])



 return (
   <View style={styles.container}>
  <Text>Welcome!</Text>
  <Button title="Start Background Service" onPress={()=>{
    ReactNativeForegroundService.start({
      id: 144,
      title: "Foreground Service",
      message: '{location.coords.latitude}',
    });
  }} />
  <Button title="Stop Background Service" onPress={()=>{
    ReactNativeForegroundService.stop({
      id: 144,
      title: "Foreground Service",
      message: "you are online!",
    });
  }} />

  <View
    style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
    <Button title="Get Location" onPress={getLocation} />
  </View>
  <Text>Watch Location</Text>
  <Text>Latitude:{location ? location.coords.latitude : null} </Text>
  <Text>Longitude: {location ? location.coords.longitude : null}</Text>
  <Text>Current Location</Text>
  <Text>Latitude:{currentlocation ? currentlocation.coords.latitude : null} </Text>
  <Text>Longitude: {currentlocation ? currentlocation.coords.longitude : null}</Text>
  <View
    style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
  </View>
</View>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#fff',
   alignItems: 'center',
   justifyContent: 'center',
 },
});

export default App;