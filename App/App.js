import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';

export default class FlatListBasics extends Component {
  render() {
    return (
      <View style={styles.container}>
        
          <Text style={styles.item}>Build</Text>
          <Text style={styles.item}>Part search</Text>
          <Text style={styles.item}>About</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22,   
  },

  item: {
    flex: 1,
    margin: 10,
    backgroundColor: 'red',
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center'

    },
})