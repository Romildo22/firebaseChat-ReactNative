import React from 'react';
import { Text, TextInput, View, TouchableOpacity, AsyncStorage } from 'react-native';
import firebase from 'firebase'
import User from '../User'
import styles from '../constantes/styles'

export default class App extends React.Component{ 
    static navigationOptions = {
        header: null
    }
  state = {
    phone: '',
    name: '',
  }
  handlerChange = key => val => {
    this.setState({ [key]: val})
  }
  Unsafe_componentWillMount(){
    AsyncStorage.getItem('userPhone').then(val=>{
      if(val){ this.setState({phone:val})}
    })
  }
  submitForm = async () =>{
    if(this.state.phone.length < 9){
      alert('Error', 'Telefone não existe')
    }else if(this.state.name.length <3){
      alert('Error', 'Nome muito curto')
    }else{
    //save user data
    await AsyncStorage.setItem('userPhone',this.state.phone);
    User.phone = this.state.phone
    firebase.database().ref('users/' + User.phone).set({name: this.state.name})
    this.props.navigation.navigate('App')
    }
  }

render(){
  return(
      <View style={styles.container}>
         <TextInput
         placeholder="Número do telefone"
         keyboardType="number-pad"
         style={styles.input}
         value={this.state.phone}
         onChangeText={this.handlerChange('phone')}
         />
         <TextInput
         placeholder="Nome"
         style={styles.input}
         value={this.state.name}
         onChangeText={this.handlerChange('name')}
         />
          <TouchableOpacity onPress={this.submitForm}>
            <Text style={styles.btnText}> Confirmar </Text>
          </TouchableOpacity>

      </View>
  );
 }
}