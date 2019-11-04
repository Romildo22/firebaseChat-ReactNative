import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
} from 'react-native';
import firebase from 'firebase'
import User from '../User'

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  UNSAFE_componentWillMount() {
    var firebaseConfig = {
      apiKey: "AIzaSyDZaHJWutGNCjTo_IhHjZG-CeBSXklgeGk",
      authDomain: "fir-chatteste.firebaseapp.com",
      databaseURL: "https://fir-chatteste.firebaseio.com",
      projectId: "fir-chatteste",
      storageBucket: "fir-chatteste.appspot.com",
      messagingSenderId: "774248371373",
      appId: "1:774248371373:web:905907a7678c4724dfe224",
      measurementId: "G-JDW8KWR41T"
    };
    // Initialize Firebase
    if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    }
  }

  componentDidMount() {
    this._bootstrapAsync();
  }
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('userPhone');
    this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
  };

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}