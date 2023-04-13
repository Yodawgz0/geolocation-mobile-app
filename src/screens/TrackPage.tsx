import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {TrackPageStyles} from '../Styles/TrackPageStyle';

interface position {
  longitude: string;
  latitude: string;
  speed: string;
  accuracy: string;
  city?: string;
  state?: string;
}

export default function Tracking() {
  const [position, setPosition] = useState<position>({
    longitude: '',
    latitude: '',
    speed: '',
    accuracy: '',
    city: '',
    state: '',
  });
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  useEffect(() => {
    return () => {
      clearWatch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [permissionArr, setPermissionArr] = useState<[boolean, boolean]>([
    true,
    true,
  ]);

  useEffect(() => {
    //console.log(8, JSON.parse(position).coords);
    //post to 192.168.0.11
  }, [position]);

  const clearWatch = () => {
    subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
    setSubscriptionId(null);
    setPosition({
      latitude: '',
      longitude: '',
      accuracy: '',
      speed: '',
    });
  };

  const askPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'GeoApp',
          message: 'GeoApp access to your location ',
          buttonPositive: 'Provide Access please',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use fine the location');
        setPermissionArr([true, permissionArr[1]]);
      } else {
        console.log('location permission denied');
      }
      const grantedTwo = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'GeoApp',
          message: 'GeoApp access to your location ',
          buttonPositive: 'Provide Access please',
        },
      );
      if (grantedTwo === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the coarse location');
        setPermissionArr([permissionArr[0], true]);
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const watchPosition = () => {
    askPermission().then(() => {
      if (permissionArr[0] && permissionArr[1]) {
        try {
          const watchID = Geolocation.watchPosition(
            position => {
              const oongaBoonga = 'fdc6f6ac1a564e59ada63a41df878bbe';
              const latitude = position.coords.latitude + '';
              const longitude = position.coords.longitude + '';

              const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${oongaBoonga}`;

              fetch(url)
                .then(response => response.json())
                .then(data => {
                  console.log('Fetched data');
                  setPosition({
                    latitude: position.coords.latitude + '',
                    longitude: position.coords.longitude + '',
                    speed: position.coords.speed + '',
                    accuracy: position.coords.accuracy + '',
                    state: data.results[0].components.state,
                    city: data.results[0].components.city,
                  });
                })
                .catch(error => console.log(error));
            },
            error => Alert.alert('WatchPosition Error', JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
          setSubscriptionId(watchID);
        } catch (error) {
          Alert.alert('WatchPosition Error', JSON.stringify(error));
        }
      } else {
        console.log(permissionArr);
      }
    });
  };
  return (
    <SafeAreaView>
      <ScrollView>
        <StatusBar backgroundColor="#483D8B" />
        <View style={[TrackPageStyles.container, TrackPageStyles.horizontal]}>
          <View style={TrackPageStyles.positionInfo}>
            {subscriptionId !== null && position.latitude.length === 0 ? (
              <ActivityIndicator
                style={TrackPageStyles.loader}
                size="large"
                color="#0000ff"
              />
            ) : subscriptionId !== null ? (
              <>
                <Text style={TrackPageStyles.positionText}>
                  <Text>Longitude: {position.longitude.substring(0, 8)} </Text>
                  <Text>
                    {'\n'}Latitude: {position.latitude.substring(0, 8)}{' '}
                  </Text>
                  <Text>
                    {'\n'}Speed: {position.speed.substring(0, 4)}{' '}
                  </Text>
                  <Text>
                    {'\n'}Accuracy: {position.accuracy}{' '}
                  </Text>
                </Text>
                {position.city?.length && position.state?.length ? (
                  <Text>
                    <Text style={TrackPageStyles.StatandCitytext}>
                      {'\n'}City: {position.city}
                    </Text>
                    <Text style={TrackPageStyles.StatandCitytext}>
                      {'\n'}State: {position.state}
                    </Text>
                  </Text>
                ) : (
                  <View style={TrackPageStyles.StateandCityLoader}>
                    <Text style={TrackPageStyles.StatandCitytext}>
                      {'\n'} Locating state and city...
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                <Text style={TrackPageStyles.positionText}>Click to start</Text>
              </>
            )}
          </View>
          {subscriptionId !== null ? (
            <TouchableOpacity onPress={clearWatch}>
              <Text style={TrackPageStyles.stopButton}>Stop Tracking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={watchPosition}>
              <Text style={TrackPageStyles.startButton}>Start Tracking</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
