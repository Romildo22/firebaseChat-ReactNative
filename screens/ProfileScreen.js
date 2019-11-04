import React from 'react'
import styles from '../constantes/styles'
import {SafeAreaView, Text, TextInput, TouchableOpacity, Alert, AsyncStorage} from 'react-native'
import User from '../User'
import firebase from 'firebase'

export default class ProfileScreen  extends React.Component{
    static navigationOptions = ({navigation}) => {
        return{
        title:'Profile'
        }
    }
    state ={
        name:User.name
    }
    handlerChange = key => val => {
        this.setState({[key]:val})
    }
    _logOut = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }
    salvarNome = async () => {
        if(this.state.name.length>3){
            Alert.alert('Erro ao salvar', 'Por favor, insira um nome maior !')
        } else if(User.name !== this.state.name){
        firebase.database().ref('users').child(User.phone).set({name:this.state.name})
        User.name = this.state.name
        Alert.alert('Nome alterado com sucesso !', 'Nome salvo')
        }else{
            Alert.alert('Este é o mesmo nome que foi salvo !')
        }
    }
    render(){
        return(
            <SafeAreaView style={styles.container}>
                <Text style={{fontSize:20}}>
                    {User.phone}
                </Text>
                <TextInput
                style={styles.input}
                value={this.state.name}
                onChangeText={this.handlerChange('name')}
                />
                <TouchableOpacity onPress={this.salvarNome}>
                <Text style={styles.btnText}>Salvar Nome</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this._logOut}>
                <Text style={styles.btnText,{paddingTop:10}}>Deslogar</Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}