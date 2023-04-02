import Geolocation from '@react-native-community/geolocation';
import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Button,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [position, setPosition] = useState<string | null>(null);
  const [permissionArr, setPermissionArr] = useState<[boolean, boolean]>([
    false,
    true,
  ]);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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
        Alert.alert('You can use fine the location');
        setPermissionArr([true, permissionArr[1]]);
      } else {
        console.log('location permission denied');
        Alert.alert('Location permission denied');
      }
      // const grantedTwo = await PermissionsAndroid.request(
      //   PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      //   {
      //     title: 'GeoApp',
      //     message: 'GeoApp access to your location ',
      //     buttonPositive: 'Provide Access please',
      //   },
      // );
      // if (grantedTwo === PermissionsAndroid.RESULTS.GRANTED) {
      //   console.log('You can use the coarse location');
      //   Alert.alert('You can use the coarse location');
      //   setPermissionArr([permissionArr[0], true]);
      // } else {
      //   console.log('location permission denied');
      //   Alert.alert('Location permission denied');
      // }
    } catch (err) {
      console.warn(err);
    }
  };
  const getCurrentPosition = () => {
    askPermission().then(() => {
      if (permissionArr[0] && permissionArr[1]) {
        Geolocation.getCurrentPosition(
          pos => {
            console.log(pos);
            setPosition(JSON.stringify(pos));
          },
          error =>
            Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
          {enableHighAccuracy: true},
        );
      } else {
        console.log(permissionArr);
      }
    });
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>
            <Text style={styles.sectionTitle}>Current position: </Text>
            {position}
          </Text>
          <Button title="Get Current Position" onPress={getCurrentPosition} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
