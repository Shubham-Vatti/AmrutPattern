import React, { useState, useContext, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList, ToastAndroid, SafeAreaView } from 'react-native';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Theme';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../App';
import axios from 'axios';
import { FacebookLoader } from 'react-native-easy-content-loader';
import Config from 'react-native-config';
import { translator } from '../locales/I18n';


export function ChatScreen({ navigation }) {

    const [chats, setchats] = useState([]);
    const { signOut, language, isNetworkAvailable } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    
    const MonthList = ["Jan", "Fab", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    useFocusEffect(
        useCallback(() => {
            const getToken = async () => {
                let checkToken = await AsyncStorageLib.getItem("amrut_session");

                if (checkToken == null) {
                    signOut();
                    return;
                }
                const getChatListApiUrl = `${Config.API_BASE_URL}/customer-chat-list`;
                axios
                    .get(getChatListApiUrl, { headers: { 'Authorization': checkToken } })
                    .then((res) => {
                        if (res.data.success == true) {
                            setchats(res.data.response);
                        }
                        else {
                            ToastAndroid.show("No chats found", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        }
                        setLoading(true);
                    })
                    .catch((err) => {
                        // ToastAndroid.show("Sonthing Went wrong", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
                    })
            }
            getToken();
        }, [isNetworkAvailable])
    )
    useFocusEffect(
        useCallback(() => {
            let interval = setInterval(() => {
                const getToken = async () => {
                    let checkToken = await AsyncStorageLib.getItem("amrut_session");

                    if (checkToken == null) {
                        signOut();
                        return;
                    }
                    const getChatListApiUrl = `${Config.API_BASE_URL}/customer-chat-list`;
                    axios
                        .get(getChatListApiUrl, { headers: { 'Authorization': checkToken } })
                        .then((res) => {
                            if (res.data.success == true) {
                                setchats(res.data.response);
                            }
                            else {
                                // ToastAndroid.show("No chats found", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                            }
                            setLoading(true);
                        })
                        .catch((err) => (
                            ToastAndroid.show("Sonthing Went wrong", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
                        ))
                }
                getToken();
            }, 20000);
            return () => {
                clearInterval(interval);
            }
        }, [isNetworkAvailable])
    )

    const Slice = (value) => {
        return ('0' + value).slice(-2)
    }

    const getTime = (date) => {
        if (!date) {
            return "";
        }
        const curDate = new Date();
        const newDate = new Date(date);
        if (curDate.toLocaleDateString() === newDate.toLocaleDateString()) {
            let hour = newDate.getHours() > 12 ? newDate.getHours() % 12 : newDate.getHours();
            return `${Slice(hour)}:${Slice(newDate.getMinutes())} ${newDate.getHours() >= 12 ? 'PM' : 'AM'}`;
        } else {
            return `${Slice(newDate.getDay())} ${MonthList[newDate.getMonth()]} ${newDate.getUTCFullYear() % 100}`;
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodybackground }}>
            {
                loading ?
                    <>
                        {
                            (chats.length > 0) ?
                                <>
                                    <FlatList style={{ backgroundColor: Colors.bodybackground }}
                                        data={chats}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity
                                                activeOpacity={0.9}
                                                style={{ ...styles.card, marginTop: (index === 0) ? 12 : 0 }}
                                                onPress={() => navigation.navigate("ChatView", { image: item.crop_image, title: item.title, chat_id: item.id, crop_name: item.crop_name })}
                                            >
                                                <Image source={(item.crop_image == null) ? require('../assets/defaultCrop.png') : { uri: `${item.crop_image}` }} style={styles.image} />
                                                <View style={{ marginStart: 10, width: '80%' }}>
                                                    <View style={styles.messgeText}>
                                                        <Text style={{ ...styles.title, width: (item.unReadMessages !== undefined && item.unReadMessages > 0) ? "84%" : "98%" }} numberOfLines={1}>
                                                            {item.title}&nbsp;({item.crop_name ?? item.crop_name})
                                                        </Text>
                                                        {
                                                            (item.unReadMessages !== undefined && item.unReadMessages > 0) &&
                                                            <View style={styles.unreadMessagesCount}>
                                                                <Text style={{ fontSize: 10, fontWeight: '500', color: Colors.white, }} >{item.unReadMessages}</Text>
                                                            </View>
                                                        }
                                                    </View>
                                                    <View style={styles.messgeText}>
                                                        <Text style={{ ...styles.desc, width: "78%" }} numberOfLines={1}>
                                                            {
                                                                (item.last_message_sent_by === "customer") &&
                                                                <>
                                                                    <Ionicon name='checkmark-sharp' size={15} color={'#000'} />&nbsp;
                                                                </>
                                                            }
                                                            {item.description}
                                                        </Text>
                                                        <Text style={{ fontSize: 12 }}>
                                                            {item.last_message_sent_at ? getTime(item.last_message_sent_at) : ""}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </>
                                :
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, flex: 1 }}>
                                    <Text style={{ fontSize: 18, textAlign: 'center' }} >{translator("chat.no_chat", language)}</Text>
                                </View>
                        }
                    </>
                    :
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20, marginTop: 10, flex: 1 }}>
                        <FacebookLoader active avatar pRows={0} />
                        <FacebookLoader active avatar pRows={0} />
                        <FacebookLoader active avatar pRows={0} />
                        <FacebookLoader active avatar pRows={0} />
                        <FacebookLoader active avatar pRows={0} />
                        <FacebookLoader active avatar pRows={0} />
                    </View>
            }
            <View>
                <TouchableOpacity style={styles.floatBtn} activeOpacity={0.8} onPress={() => {
                    navigation.navigate("ChatForm");
                }}>
                    <Ionicon name='add' size={45} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default function ChatListScreen() {
    return (
        <View></View>
    );
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // },
    text: {
        fontSize: 30,
        margin: 10,
        textAlign: 'center',
    },
    chatTitle: {
        fontSize: 22,
        marginBottom: 5
    },
    iconStyle: {
        position: 'absolute',
        height: 60,
        width: 60,
        bottom: 30,
        right: 20,
        borderRadius: 100,
        backgroundColor: '#808080',
    },
    cardStyling: {
        borderRadius: 500,
    },
    chatform: {
        flexDirection: 'row',
        padding: 1,
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        borderColor: '#808080',
        margin: 12,
    },
    input: {
        width: '75%',
        height: 60,
        padding: 5,
        fontSize: 20,
    },
    message: {
        padding: 10,
        backgroundColor: Colors.white,
        borderRadius: 20,
        marginRight: 4,
        margin: 20
    },
    response: {
        padding: 10,
        backgroundColor: Colors.green,
        borderRadius: 20,
        marginLeft: 4,
        margin: 20
    },
    constainer: {
        paddingHorizontal: 15
    },
    card: {
        backgroundColor: "rgba(0,0,0,0.25)",
        padding: 10,
        marginBottom: 10,
        flexDirection: "row",
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10
    },
    image: {
        // resizeMode: "stretch",
        height: 50,
        width: 50,
        marginEnd: 8,
        borderRadius: 50
    },
    title: {
        fontSize: 18,
        color: "#000",
    },
    desc: {
        fontSize: 14,
    },
    floatBtn: {
        position: "absolute",
        // top: 50,
        bottom: 18,
        right: 18,
        backgroundColor: Colors.secondary,
        height: 60,
        width: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        paddingStart: 3
    },
    unreadMessagesCount: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginLeft: 10,
        backgroundColor: Colors.secondary,
        borderRadius: 20,
        width: 24,
        height: 24
    },
    messgeText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 3
    }
});