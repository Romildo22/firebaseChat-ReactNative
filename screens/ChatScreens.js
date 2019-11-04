import React from 'react'
import { TextInput, Text, View, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native'
import styles from '../constantes/styles'
import User from '../User'
import firebase from 'firebase'
import { FlatList } from 'react-native-gesture-handler'

export default class ChatScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('name', null)
        }
    }
    constructor(props) {
        super(props)
        this.state = {
            person: {
                name: props.navigation.getParam('name'),
                phone: props.navigation.getParam('phone')
            },
            textMessage: '',
            messageList: []
        }
    }
  
    UNSAFE_componentWillMount(){
        let bdREF = firebase.database().ref('mensagens')
        bdREF.child(User.phone).child(this.state.person.phone)
        .on('child_added', (value) => {
            this.setState((prevState) => {
                return{ 
                    messageList:[...prevState.messageList, value.val()]
                }
            })
        })
    }

    handleChange = key => val => {
        this.setState({ [key]: val })
    }

    convertTime = (time) =>{
        let d = new Date(time)
        let c = new Date()
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':'
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
        if(c.getDay() !== d.getDay()){
            result = d.getDay() + ' ' + d.getMonth() + ' ' + result
        }
        return result
    }

    sendMessage = async () => {
        if (this.state.textMessage.length > 0) {
            let msgID = firebase.database().ref('mensagens').child(User.phone).child(this.state.person.phone).push().key
            let updates = {}
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone
            }
            updates['mensagens/ ' + User.phone + '/' + this.state.person.phone + '/' + msgID] = message
            updates['mensagens/ ' + this.state.person.phone + '/' + User.phone + '/' + msgID] = message
            firebase.database().ref().update(updates)
            this.setState({ textMessage:'' })
        }
    }

    renderRow = ({item}) => {
        return(
            <View style={{
                flexDirection:'row',
                width:'60%',
                alignSelf: item.from===User.phone ? 'flex-end' : 'flex-start',
                backgroundColor: item.from===User.phone ? '#00897b' : '#7cv342',
                borderRadius:5,
                marginBottom:10
             }}>
            <Text style={{color:'#fff',padding:20, fontSize:16}}>
                    {item.message}
            </Text>
            <Text style={{color:'#eee', padding:3, fontSize:12}}>
            {item.item}
            </Text>
             </View>
        )
    }

    render() {
        let{height,width} = Dimensions.get('window')
        return (
            <SafeAreaView>
                <FlatList
                style={{padding:10, height: height * 0.75}}
                data={this.state.messageList}
                renderItem={this.renderRow}
                keyExtractor={(item,index) => index.toString()}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center',marginHorizontal:5 }}>
                    <TextInput
                        style={styles.input}
                        value={this.state.textMessage}
                        placeholder="Click para digitar..."
                        onChangeText={this.handleChange('textMessage')}
                    />
                    <TouchableOpacity
                    onPress={this.sendMessage}
                    style={{paddingBottom:10, marginLeft:5}}
                    >
                    <Text style={styles.btnText}> Enviar </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }
}