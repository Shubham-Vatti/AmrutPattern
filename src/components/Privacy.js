import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, useWindowDimensions, SafeAreaView, ActivityIndicator, ToastAndroid } from 'react-native';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../App';
import { Colors } from '../constants/Theme';
import axios from 'axios';
import Config from 'react-native-config';
import RenderHTML from 'react-native-render-html';

export default function Privacy() {

    const [privacyData, setPrivacyData] = useState({});
    const { signOut, language, isNetworkAvailable ,AppVersion} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const { width } = useWindowDimensions();
    useEffect(() => {
        const getToken = async () => {
            let checkToken = await AsyncStorageLib.getItem("amrut_session");
            if (checkToken == null) {
                signOut();
                return;
            }
            const getApiUrl = `${Config.API_BASE_URL}/page-content?language=${language}&version=${AppVersion}`;
            axios.get(getApiUrl, { headers: { 'Authorization': checkToken } })
                .then((res) => {
                    if (res.data.success == true) {
                        setPrivacyData(res.data.response);
                    } else {
                        setPrivacyData({});
                        ToastAndroid.show("Somthing went Wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
                    }
                    setLoading(true);
                }).catch(function (error) {
                    // handle error
                    // alert(error.message);
                    ToastAndroid.show("Somthing went Wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
                })
        }
        getToken();
    }, [isNetworkAvailable]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodybackground }}>
            {
                loading ?
                    <ScrollView>
                        <View style={styles.container}>
                            <Image style={styles.logoimage} source={require('../assets/logo.png')} />
                        </View>
                        <View style={{ padding: 20, backgroundColor: Colors.bodybackground}}>
                            <RenderHTML contentWidth={width} source={{ html: privacyData.privacy_policy }} />
                        </View>
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" />
                    </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#e8e8e8',
    },
    logoimage: {
        height: 150,
        width: 120,
        alignSelf: 'center'
    }
})