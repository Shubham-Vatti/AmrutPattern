import { View, Text, ScrollView, StyleSheet, Image, SafeAreaView, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Colors } from '../constants/Theme'
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';
import { AuthContext } from '../../App';
import { translator } from '../locales/I18n';

const CustomerSubscribedDetails = ({ route }) => {

    const { subs_id, total } = route.params;
    console.log("subs_id", subs_id)

    const [subscribedDetails, setSubscribedDetails] = useState([]);
    const { signOut, language, isNetworkAvailable,AppVersion } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getToken = async () => {
            let checkToken = await AsyncStorageLib.getItem("amrut_session");
            if (checkToken == null) {
                signOut();
                return;
            }
            const getApiUrl = `${Config.API_BASE_URL}/subscription-list-details/${subs_id}?language=${language}&version=${AppVersion}`;
            axios.get(getApiUrl, { headers: { 'Authorization': checkToken } })
                .then((res) => {
                    if (res.data.success == true) {
                        setSubscribedDetails(res.data.response);
                    }else if (res.data.status == 401) {
                        signOut();
                        ToastAndroid.show("Session expired", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                    } else {
                        setSubscribedDetails([]);
                        ToastAndroid.show("Somthing went Wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
                    }
                    setLoading(true);
                }).catch(function (error) {
                    // handle error
                    ToastAndroid.show("Somthing went Wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
                })
        }
        getToken();
    }, [isNetworkAvailable])
    // console.log("subscribedData", subscribedDetails)

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                loading ?
                    <ScrollView style={{ backgroundColor: Colors.bodybackground }}>
                        <View style={styles.mainContainer}>
                            {
                                subscribedDetails.map((item, index) => (
                                    <View style={styles.container} key={index}>
                                        <Image source={item.image ? { uri: item.image } : require('../assets/farmer.jpg')} style={{ borderRadius: 50, height: 60, width: 60 }} />
                                        <Text style={{ ...styles.title, width: '50%' }}> {item.title} </Text>
                                        <Text style={{ ...styles.title, width: '20%' }}>   ₹ {item.subscription_charges_yearly}</Text>
                                    </View>
                                ))
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', borderTopColor: Colors.black, borderTopWidth: 1, padding: 5 }}>
                                <Text style={{ ...styles.title, }}> {translator("subscription.total", language)} - ₹ {total}.00</Text>
                            </View>
                        </View>
                    </ScrollView>
                    :
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={"large"} />
                    </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        margin: 10,
        padding: 10,
        // borderColor: Colors.black,
        // borderWidth: 1,
        // borderRadius: 10,
    },
    title: {
        fontSize: 16,
        // alignContent: 'center'
        alignSelf: 'center',
        // width: '40%'
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        flexWrap: 'wrap',
        padding: 5,
    }
})

export default CustomerSubscribedDetails