import {StyleSheet} from 'react-native';

export const TrackPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  horizontal: {
    padding: 20,
  },
  loader: {},
  positionInfo: {
    margin: 50,
  },
  stopButton: {
    color: 'white',
    backgroundColor: 'red',
    textAlign: 'center',
    padding: 10,
    borderRadius: 6,
  },
  startButton: {
    color: 'white',
    backgroundColor: 'green',
    textAlign: 'center',
    padding: 10,
    borderRadius: 6,
  },
  positionText: {
    fontSize: 25,
    color: 'darkviolet',
    display: 'flex',
    flexDirection: 'column',
  },
  StatandCitytext: {
    fontSize: 20,
    color: 'midnightblue',
    marginRight: 15,
    marginTop: 15,
  },
  StateandCityLoader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
