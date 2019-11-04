import React from 'react'
import { SafeAreaView, View, Image, Text, TouchableOpacity, FlatList } from 'react-native'
import firebase from 'firebase'
import User from '../User'

export default class HomeScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return{
        title: 'Chats',
        headerRight:(
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image source={require('../images/user.png')} style={{width:32,height:32, marginRight:10}}/>
            </TouchableOpacity>
            )
        }
    }
    state = {
        users: []
    }
    UNSAFE_componentWillMount() {
        let bdRef = firebase.database().ref('users')
        bdRef.on('child_added', (val) => {
            let person = val.val()
            person.phone = val.key

            if (person.phone === User.phone) {
                User.name = person.name
            } else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        })
    }

    renderRow = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Chat', item)}
                style={{
                    padding: 10, borderBottomColor: '#ccc',
                    borderBottomWidth: 1
                }}>
                <Text style={{ fontSize: 20 }}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    render() {
        return (
            <SafeAreaView>
                <FlatList
                    data={this.state.users}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.phone}
                />
            </SafeAreaView>
        )
    }
}
