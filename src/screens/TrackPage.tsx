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
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {TrackPageStyles} from '../Styles/TrackPageStyle';
import {zoneMapping, stateMapping} from '../Constants';
interface position {
  longitude: string;
  latitude: string;
  speed: string;
  accuracy: string;
  state?: string;
  locality?: string;
}
export default function Tracking() {
  const [position, setPosition] = useState<position>({
    longitude: '',
    latitude: '',
    speed: '',
    accuracy: '',
    locality: '',
    state: '',
  });
  const [subscriptionId, setSubscriptionId] = useState<number | null>(null);
  const [showAlertText, setShowAlertText] = useState<boolean | string>('none');
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

  useEffect(() => {}, [position]);

  const clearWatch = () => {
    subscriptionId !== null && Geolocation.clearWatch(subscriptionId);
    setSubscriptionId(null);
    setPosition({
      latitude: '',
      longitude: '',
      accuracy: '',
      speed: '',
    });
    setShowAlertText('none');
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
                  setPosition({
                    latitude: position.coords.latitude + '',
                    longitude: position.coords.longitude + '',
                    speed: position.coords.speed + '',
                    accuracy: position.coords.accuracy + '',
                    state: data.results[0].components.state,
                    locality:
                      data.results[0].components.city ||
                      data.results[0].components.county,
                  });
                  getDatafromBackend(
                    data.results[0].components.state,
                    latitude,
                    longitude,
                  );

                  console.log('data sent to backend');
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

  const getDatafromBackend = (
    stateCode: string,
    latitude: string,
    longitude: string,
  ) => {
    fetch(
      `http://10.0.2.2:80/${Object.keys(zoneMapping).filter(
        // @ts-ignore
        (e: string) => zoneMapping[e].indexOf(stateMapping[stateCode]) !== -1,
      )}/api/accidentCheck`,
      {
        method: 'POST',
        body: JSON.stringify({
          // lat: 41.080693,
          // lon: -86.5575,
          lat: latitude,
          lon: longitude,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    )
      .then(response => {
        response
          .json()
          .then(data => {
            setShowAlertText(data.status);
          })
          .catch(err => console.log('Connection Error', err));
      })
      .catch(err => console.log(err));
  };
  return (
    <SafeAreaView>
      <ImageBackground
        source={require('../assets/backimg.jpg')}
        style={TrackPageStyles.backgroundImageStyle}>
        <ScrollView>
          <StatusBar
            backgroundColor={
              showAlertText === 'none'
                ? 'gray'
                : showAlertText === true
                ? 'red'
                : 'green'
            }
          />
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
                    <Text>
                      Longitude: {position.longitude.substring(0, 8)}{' '}
                    </Text>
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
                  {position.locality?.length && position.state?.length ? (
                    <Text>
                      <Text style={TrackPageStyles.StatandCitytext}>
                        {'\n'}Locality: {position.locality}
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
                  <Text style={TrackPageStyles.positionText}>
                    Click to start!
                  </Text>
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
            {subscriptionId !== null ? (
              <View>
                {showAlertText !== 'none' ? (
                  <Text
                    style={
                      showAlertText
                        ? TrackPageStyles.StatusOfTravelTextUnSafe
                        : TrackPageStyles.StatusOfTravelTextSafe
                    }>
                    {showAlertText
                      ? 'You are going through accident prone zone!'
                      : 'You are going through safe area!'}
                  </Text>
                ) : (
                  <Text style={TrackPageStyles.StatusOfTravelTextLoading}>
                    Inspecting your location...
                  </Text>
                )}
              </View>
            ) : (
              <></>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}
