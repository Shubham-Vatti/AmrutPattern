import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Text, ScrollView, View, StyleSheet, Image, useWindowDimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import Config from 'react-native-config';
import RenderHTML from 'react-native-render-html';
import { AuthContext } from '../../App';
import { Colors } from '../constants/Theme';

export default function Terms() {

    const [termsData, setTermsData] = useState({});
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
            // console.log("hello");
            const getApiUrl = `${Config.API_BASE_URL}/page-content?language=${language}&version=${AppVersion}`;
            axios.get(getApiUrl, { headers: { 'Authorization': checkToken } })
                .then((res) => {
                    if (res.data.success == true) {
                        setTermsData(res.data.response);
                    } else {
                        ToastAndroid.show("Somthing went Wrong", ToastAndroid.LONG);
                        setTermsData({});
                    }
                    setLoading(true);
                }).catch(function (error) {
                    // handle error
                    // alert(error.message);
                })
        }
        getToken();
    }, [isNetworkAvailable]);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodybackground }}>
            {
                loading ?
                    <ScrollView style={{ backgroundColor: Colors.bodybackground }}>
                        <View style={styles.container}>
                            <Image style={styles.logoimage} source={require('../assets/logo.png')} />
                        </View>

                        <View style={{ padding: 20, backgroundColor: Colors.bodybackground }}>
                                    <RenderHTML contentWidth={width} source={{ html: termsData.terms_condition }} />
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
    },
})