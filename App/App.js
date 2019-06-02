import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, AppRegistry } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation'; 


class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('Details')}>
          <Text style={styles.item}>Click Me 111111!</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.item} onPress={() => this.props.navigation.navigate('Details')}>
          <Text style={styles.item}>Click Me!22222222</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('Details')}>
          <Text style={styles.item}>Click Me!3333333</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Details Screen</Text>
        <TouchableOpacity
          title="Go to Details... again"
          onPress={() => this.props.navigation.navigate('Details')}
        />
        <TouchableOpacity
          title="Go to Home"
          onPress={() => this.props.navigation.navigate('Home')}
        />
        <TouchableOpacity
          title="Go back"
          onPress={() => this.props.navigation.navigate()}
        />
      </View>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Details: {
      screen: DetailsScreen,
    },
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 22,
    backgroundColor: 'green',
    flex: 1   
  },

  item: {
    flex: 1,
    margin: 10,

    backgroundColor: 'blue',
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center'
    },
})