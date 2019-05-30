import React, { Component } from 'react';
import { AppRegistry, FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';

export default class FlatListBasics extends Component {
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={[
            {key: 'BUILD'},
            {key: 'PART SEARCH'},
            {key: 'ABOUT'} 
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22,
   alignItems: 'stretch',
   flexWrap: 'wrap'
   
  },
  item: {
    //alignSelf: 'center',
    //flexGrow: 1,
    margin: 10,
    backgroundColor: 'red',
    fontSize: 20,
    textAlign: 'center',
    alignSelf: 'stretch',

    },
})