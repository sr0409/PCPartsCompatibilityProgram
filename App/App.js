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
          <Text style={styles.item}>Build</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.item} onPress={() => this.props.navigation.navigate('Details')}>
          <Text style={styles.item}>Parts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('About')}>
          <Text style={styles.item}>About</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class PartsScreen extends React.Component {
  static navigationOptions = {
    title: 'Back'
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('Details')}>
          <Text style={styles.item}>CPU</Text>
        </TouchableOpacity>
        <TouchableOpacity  style={styles.item} onPress={() => this.props.navigation.navigate('Details')}>
          <Text style={styles.item}>Cooler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('Details')}>
          <Text style={styles.item}>Motherboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('Details')}>
          <Text style={styles.item}>Memory</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('Details')}>
          <Text style={styles.item}>Storage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => this.props.navigation.navigate('Details')}>
          <Text style={styles.item}>Power Supply</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class AboutScreen extends React.Component {
  static navigationOptions = {
    title: 'Back'
  };
  render() {
    return (
      <View style={styles.container}>
          <Text>Once upon a time two lazy bastards decided to write this program and now we're rich</Text>
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
      screen: PartsScreen,
    },
    About: {
      screen: AboutScreen
    }
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