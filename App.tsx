import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TrackPage from './src/screens/TrackPage';
import MainPage from './src/screens/MainPage';

function App(): JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TrackPage"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="TrackPage" component={TrackPage} />
        <Stack.Screen name="MainPage" component={MainPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
