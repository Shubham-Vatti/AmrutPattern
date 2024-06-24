// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, FlatList, ToastAndroid } from 'react-native';
// import { Colors } from '../constants/Theme';
// import { Row, Col } from 'react-native-responsive-grid-system';
// import { Icon } from 'react-native-elements';
// import { getNumberFormat } from './Utility';
// import ChatIcon from '../assets/chat-icon.png';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// import Ionicon from 'react-native-vector-icons/Ionicons';
// import AsyncStorageLib from '@react-native-async-storage/async-storage';
// import { AuthContext } from '../../App';
// import axios from 'axios';
// import ContentLoader, { FacebookLoader, InstagramLoader, Bullets } from "react-native-easy-content-loader";
// import { useFocusEffect } from '@react-navigation/native';
// import Config from 'react-native-config';
// import RazorpayCheckout from 'react-native-razorpay';


// const SubscriptionView = (props) => {
//     const { item, index } = props;
//     const [diffDay, setDiffDay] = useState(0);

//     useFocusEffect(
//         useCallback(() => {
//             const mainDate = item.subs_end_date;
//             console.log("item", item.subs_end_date);
//             const d = new Date(mainDate);
//             let apidate = d.getDate();
//             let apimonth = d.getMonth();
//             let apiyear = d.getFullYear();
//             // console.log("month", apidate)

//             const d2 = new Date();
//             let date = d2.getDate();
//             let month = d2.getMonth();
//             let year = d2.getFullYear();

//             if (d > d2) {
//                 const diffTime = Math.abs(d - d2);
//                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//                 console.log(diffTime + " milliseconds");
//                 console.log(diffDays + " days");
//                 setDiffDay(diffDays);
//             } else {
//                 console.log("-1 milliseconds");
//                 console.log("0 days");
//                 setDiffDay(0);
//             }
//         }, [])
//     )
//     // console.log(date, month, year)
//     // console.log("my date month is", d.getDate(), d.getMonth(), d.getFullYear());


//     return (
//         <>
//             {
//                 (diffDay < 1) ?
//                     <>
//                         <View style={styles.cardbody} key={index}>
//                             <View style={styles.mainContainer}>
//                                 <View style={styles.subContainer} >
//                                     <View>
//                                         {/* <Image source={ChatIcon} style={styles.image} /> */}
//                                     </View>
//                                     <View>
//                                         <View>
//                                             <Text style={{...styles.fontColor, fontSize: 18, fontWeight: '500' }}>{item.name}</Text>
//                                         </View>
//                                         <View style={{ width: 220 }}>
//                                             <Text style={{...styles.fontColor, fontSize: 16}} >{item.type}</Text>
//                                         </View>
//                                     </View>
//                                 </View>
//                                 <View >
//                                     <Text style={{...styles.fontColor, width: 55 }}>₹ {item.amount}</Text>
//                                 </View>
//                             </View>
//                             <View>
//                                 <Text style={{...styles.fontColor, fontSize: 16 }}>Expiry Date - {item.subs_end_date}</Text>
//                             </View>
//                         </View>
//                     </>
//                     :
//                     <View style={{ flex: 1, alignItems: 'center', marginTop: 60, marginHorizontal: 40 }}>
//                         <View style={{ borderWidth: 1, ...styles.fontColor, borderRadius: 50, padding: 15, flex: 1, justifyContent: 'center', textAlign: 'center', marginBottom: 20 }}>
//                             <FontAwesome5 name="medal" size={50} color="black" />
//                         </View>
//                         <Text style={{ fontSize: 30, fontWeight: 'bold', color: Colors.black }}>SUBSCRIPTION PLAN</Text>
//                         <Text style={{ fontSize: 22, marginBottom: 30, ...styles.fontColor }} >{diffDay} Days Left!</Text>
//                         <Text style={{ textAlign: 'center', fontSize: 18, ...styles.fontColor }}>Your premium plan will expire on {item.subs_end_date}</Text>
//                         <View style={{ borderWidth: 2, borderColor: "black" , width: '100%', padding: 15, marginTop: 20, borderRadius: 10, alignItems: 'center' }} >
//                             <Text style={{ ...styles.fontColor }}>₹ {item.amount} / Year ( ₹ {item.amount * 2} / 2 Year)  </Text>
//                         </View>
//                         {/* <Text>{item.subs_end_date}</Text> */}
//                     </View>
//             }

//         </>
//     )
// }

// export default function Payment() {

//     const [subscription, setSubscriptionList] = useState([]);
//     const { signOut } = useContext(AuthContext);
//     const [token, setToken] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [refreshing, setRefreshing] = useState(false);
//     const [isSubscribed, setIsSubscribed] = useState([]);

//     useFocusEffect(
//         useCallback(() => {
//             const getToken = async () => {
//                 let checkToken = await AsyncStorageLib.getItem("amrut_session");
//                 setToken(checkToken);

//                 if (checkToken == null) {
//                     signOut();
//                     return;
//                 }
//                 const getChatListApiUrl = `${Config.API_BASE_URL}/customer-subscription-list`;
//                 axios
//                     .get(getChatListApiUrl, { headers: { 'Authorization': checkToken } })
//                     .then((res) => {
//                         console.log(res.data.response)
//                         if (res.data.success == true) {
//                             // data = res.data.response;
//                             setSubscriptionList(res.data.response);

//                         }
//                         else {
//                             ToastAndroid.show("No any subscription", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
//                         }
//                         setLoading(true);
//                     })
//                     .catch((err) => (
//                         // alert(err)
//                         ToastAndroid.show("Sonthing Went wrong", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
//                     ))

//                 const getSubscribedApiUrl = `${Config.API_BASE_URL}/customer-details`;
//                 axios
//                     .get(getSubscribedApiUrl, { headers: { 'Authorization': checkToken } })
//                     .then((res) => {
//                         if (res.data.success == true) {
//                             setIsSubscribed(...res.data.response);
//                         } else {
//                             ToastAndroid.show("Subscription subscription", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
//                         }
//                     })
//                     .catch((err) => {
//                         // alert(err)
//                         ToastAndroid.show("Subscription subscription", ToastAndroid.SHORT, ToastAndroid.BOTTOM)
//                     })
//             }
//             getToken();
//         }, [refreshing])
//     )
//     // console.log(token);
//     console.log("my subscription is -", isSubscribed.is_subscribe)

//     const takeSubscription = () => {
//         // alert("hello");
//         let order_Id_url = `${Config.API_BASE_URL}/create-order-id`;
//         axios
//             .post(order_Id_url, {subscription_id: 1}, { headers: { "Authorization": token } })
//             .then((res) => {
//                 if (res.data.success === true) {
//                     razor_checkout(res.data.response.id, res.data.response.amount);
//                 } else if (res.data.message && res.data.message == 'Unauthorized Access') {
//                     ToastAndroid.show("Your session is expired, please login again", ToastAndroid.LONG, ToastAndroid.BOTTOM);
//                     signOut();
//                 } else {
//                     ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
//                 }
//             })
//             .catch((err) => {
//                 ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
//             })
//     }

//     const razor_checkout = (order_id, amount) => {
//         let option = {
//             description: 'Credits towards consultation',
//             currency: 'INR',
//             key: 'rzp_test_HjO9mxqcfKICek',
//             amount: amount,
//             name: 'Amrut Pattern',
//             order_id: order_id,
//         };

//         // razorpay screen open
//         RazorpayCheckout
//             .open(option)
//             .then((res) => {
//                 console.log("razorpay success - ", res);
//                 ToastAndroid.show("Payment Successfully", ToastAndroid.LONG, ToastAndroid.CENTER)
//                 // after payment success server calling
//                 // paymetnSuccess();
//             })
//             .catch((er) => {
//                 console.log("razorpay error - ", er);
//                 if (er.code && er.code === 0) {
//                     ToastAndroid.show("Payment cancelled", ToastAndroid.LONG, ToastAndroid.BOTTOM);
//                 } else {
//                     ToastAndroid.show("Somthing went worng", ToastAndroid.LONG, ToastAndroid.BOTTOM);
//                 }
//             })
//     }

//     // const paymetnSuccess = () => {
//     //     const getsubscriptionApiUrl = `${Config.API_BASE_URL}/customer-subscription`;
//     //     axios
//     //         .post(getsubscriptionApiUrl, { "subscription_id": 1 }, { headers: { 'Authorization': token } })
//     //         .then((res) => {
//     //             if (res.data.success == true) {
//     //                 ToastAndroid.show("Your subscription Done", ToastAndroid.LONG, ToastAndroid.BOTTOM);
//     //                 setRefreshing(true);
//     //             } else {
//     //                 ToastAndroid.show("Somthing went worng", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
//     //             }
//     //         })
//     //         .catch((err) => {
//     //             // alert(err);
//     //             ToastAndroid.show("Somthing went wrong", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
//     //         })
//     // }

//     return (
//         <>
//             <View style={{ flex: 1, justifyContent: 'center', backgroundColor: Colors.bodybackground }}>
//                 <ScrollView  >
//                     {
//                         loading ?
//                             <>
//                                 {
//                                     <>
//                                         {
//                                             (subscription.length) ?
//                                                 subscription.reverse().map((item, index) => (
//                                                     <SubscriptionView item={item} key={index} />
//                                                 ))
//                                                 :
//                                                 <View style={styles.message}>
//                                                     <Text style={{ fontSize: 20, color: 'black', textAlign: 'center', fontWeight: '500' }} > You Don't have any subscription, Please Subscribe </Text>
//                                                 </View>
//                                         }
//                                     </>
//                                 }
//                             </>
//                             :
//                             <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20 }}>
//                                 <InstagramLoader />
//                             </View>
//                     }

//                 </ScrollView>
//             </View>
//             <View>
//                 {
//                     loading ?
//                         <View pointerEvents={(isSubscribed.is_subscribe == 1) ? "none" : "auto"} style={{ backgroundColor: Colors.white, }}>
//                             <TouchableOpacity activeOpacity={2} style={(isSubscribed.is_subscribe == 1) ? styles.desabledBtn : styles.button} onPress={() => { takeSubscription() }}>
//                                 <Text style={styles.buttontext}>
//                                     {(isSubscribed.is_subscribe == 1) ? "Subscribed" : "Subscribe"}
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>
//                         :
//                         <></>
//                 }
//             </View>
//         </>
//     )
// }

// const styles = StyleSheet.create({
//     card: {
//         backgroundColor: "#fff",
//         padding: 10,
//         marginBottom: 10,
//         flexDirection: "row",
//         marginHorizontal: 15,
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         borderRadius: 20,
//         borderWidth: 1,
//         borderColor: '#c3c3c3',
//     },
//     image: {
//         resizeMode: "stretch",
//         height: 50,
//         width: 50,
//         marginEnd: 8
//     },
//     title: {
//         fontSize: 18,
//         color: "#000",
//         fontWeight: "bold"
//     },
//     desc: {
//         fontSize: 14,
//         width: 230,
//     },
//     button: {
//         backgroundColor: Colors.secondary,
//         padding: 10,
//         justifyContent: 'center',
//         borderRadius: 7,
//         // marginTop: 8,
//         marginHorizontal: 15,
//         marginVertical: 10,
//     },
//     desabledBtn: {
//         backgroundColor: "rgba(0,0,0,0.2)",
//         padding: 10,
//         justifyContent: 'center',
//         borderRadius: 10,
//         // marginTop: 8,
//         marginHorizontal: 15,
//         marginVertical: 15,
//         pointerEvents: 'none'
//     },
//     buttontext: {
//         color: Colors.white,
//         fontSize: 20,
//         textAlign: 'center',
//         fontWeight: 'bold',
//     },
//     mainContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         // marginLeft: 10,
//         // marginRight: 10,
//     },
//     subContainer: {
//         // padding: 5,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     cardbody: {
//         // margin: 4,
//         padding: 10,
//         // width: '100%',
//         backgroundColor: Colors.white,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: '#c3c3c3',
//         marginHorizontal: 20,
//         marginVertical: 10,

//     },
//     floatBtn: {
//         position: "absolute",
//         bottom: 30,
//         right: 18,
//         backgroundColor: Colors.secondary,
//         height: 60,
//         width: 60,
//         borderRadius: 30,
//         justifyContent: "center",
//         alignItems: "center",
//         paddingStart: 3
//     },
//     message: {
//         flex: 1,
//         marginTop: '50%',
//         alignSelf: 'center',
//         backgroundColor: '#eeefef',
//         borderRadius: 10,
//         padding: 10,
//         marginHorizontal: 20
//     },
//     fontColor: {
//         color: 'black'
//     }
// })