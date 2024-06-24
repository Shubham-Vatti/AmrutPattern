import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Colors } from '../constants/Theme'
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';
import { AuthContext } from '../../App';
import { translator } from '../locales/I18n';

const CustomerSubscribedList = ({ navigation }) => {

    const [subscribedData, setSubscribedData] = useState([]);
    const { signOut, language, isNetworkAvailable ,AppVersion} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getToken = async () => {
            let checkToken = await AsyncStorageLib.getItem("amrut_session");
            if (checkToken == null) {
                signOut();
                return;
            }
            const getApiUrl = `${Config.API_BASE_URL}/subscription-deatails?language=${language}&version=${AppVersion}`;
            axios.get(getApiUrl, { headers: { 'Authorization': checkToken } })
                .then((res) => {
                    if (res.data.success == true) {
                        setSubscribedData(res.data.response);
                    }else if (res.data.status == 401) {
                        signOut();
                        ToastAndroid.show("Session expired", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                    } else {
                        setcropsData([]);
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
    // console.log("subscribedData", subscribedData)

    const subscribeDetails = (item) => {
        navigation.navigate("Subscription Details", {
            subs_id: item.id,
            total: item.amount
        })
    }
    const mydate = (mydate) => {
        // console.log("mydate is", mydate);
        const monthNames = ["","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let formattedDate = (mydate.split(' ')[0]).split('-');
        console.log("formattedDate", formattedDate)
        let newFormattedDate = formattedDate[2] + ' ' + monthNames[parseInt(formattedDate[1])] + ' ' + formattedDate[0];
        return newFormattedDate;
    }
    return (
        <View style={{ flex: 1 }}>

            {
                loading ?
                    <>
                        {
                            subscribedData.length > 0 ?
                                <ScrollView style={{ backgroundColor: Colors.bodybackground, flex: 1 }}>
                                    {
                                        subscribedData.map((item, index) => (
                                            <TouchableOpacity TouchableOpacity={0.5} onPress={() => subscribeDetails(item)} key={index}>
                                                <View style={{...styles.container, marginTop: (index === subscribedData.length-1) ? 0 : 10}} >
                                                    <Text style={styles.title}> {mydate(item.subs_start_date)}</Text>
                                                    <Text style={styles.title}>{item.subscriptionDays + translator("subscription.days", language)}</Text>
                                                    <Text style={styles.title}>₹ {item.amount}.00</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView>
                                :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 20, fontWeight: '500' }}>{translator("my_crop.no_payment", language)}</Text>
                                </View>
                        }

                    </>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size={"large"} />
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 10,
        borderColor: 'rgba(0,0,0,0.3)',
        borderWidth: 1,
        margin: 10,
        backgroundColor: 'white',
    },
})

export default CustomerSubscribedList