// import AsyncStorageLib from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import React, { useContext, useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
// import { AuthContext } from '../../App';
// import { Colors } from '../constants/Theme';
// import { Card } from 'react-native-elements';
// import { useFocusEffect } from '@react-navigation/native';
// import { useCallback } from 'react';

// const HomeAddedCrop = ({ item, navigation }) => {

//     const CropDetails = (item, itemimage) => {
//         navigation.navigate('About Crop', {
//             crop_id: item,
//             crop_image: itemimage,
//         })
//     }
//     return (
//         <>
//             <View style={{ flex: 1, alignItems: "center", paddingTop: 20 }} >
//                 <TouchableOpacity activeOpacity={0.5} onPress={() => { CropDetails(item.crop_id, item.image) }}>
//                     <Image source={(item.image == null) ? require('../assets/defaultCrop.png') : { uri: item.image }} style={styles.image} />
//                 </TouchableOpacity>
//                 <Text style={styles.paragraph}>{item.title}</Text>
//             </View>
//         </>
//     )
// }

// const HomeNews = ({ newsitem, navigation }) => {
//     const newsData = (item) => {
//         navigation.navigate('News Description', {
//             news_id: item
//         })
//     }

//     return (
//         <View style={{ marginHorizontal: 5 }}>
//             <TouchableOpacity activeOpacity={0.5} onPress={() => { newsData(newsitem.id) }}>
//                 <Card style={{ width: '100%' }}>
//                     <View style={styles.mainContainer}>
//                         <View style={styles.subContainer}  >
//                             <Image source={(newsitem.crop_image == null) ? require('../assets/defaultCrop.png') : { uri: newsitem.crop_image }} style={styles.crop_image} />
//                             <Text style={{ fontSize: 18, fontWeight: '500', padding: 5, }}> {newsitem.crop_name} </Text>
//                         </View>
//                         <Text style={{ fontSize: 12, fontWeight: '500', padding: 5, textAlign: 'right', }}> {newsitem.news_date} </Text>
//                     </View>

//                     <Card.Image source={(newsitem.image == null) ? require('../assets/defaultCrop.png') : { uri: newsitem.image }} style={styles.newsimage} />
//                     <Text style={{ fontSize: 18, paddingBottom: 5, }}>{newsitem.title}</Text>
//                 </Card>
//             </TouchableOpacity>
//         </View>
//     )
// }

// const HomeScreen = ({ navigation }) => {

//     const { signOut } = useContext(AuthContext);
//     const [addedCropData, setAddedCropData] = useState([]);
//     const [token, setToken] = useState();

//     const [homeNewsData, setHomeNewsData] = useState([]);

//     useFocusEffect(
//         useCallback(()=>{
//             const getToken = async () => {
//                 let checkToken = await AsyncStorageLib.getItem("amrut_session");
//                 setToken(checkToken);
    
//                 if (checkToken == null) {
//                     signOut();
//                     return;
//                 }
    
//                 const favCropGetApiUrl = "http://amrutpattern.kandid.in/api/customer-crops-list";
//                 axios
//                     .get(favCropGetApiUrl, { headers: { 'Authorization': checkToken } })
//                     .then((res) => {
//                         if (res.data.success == true) {
//                             setAddedCropData(res.data.response)
//                         } else if (res.data.message == 'Unauthorized Access') {
//                             signOut();
//                         } else {
//                             alert("Error");
//                         }
//                     })
    
//                 const getNewsApiUrl = "http://amrutpattern.kandid.in/api/news";
//                 axios
//                     .get(getNewsApiUrl, { headers: { 'Authorization': checkToken } })
//                     .then((res) => {
//                         if (res.data.success == true) {
//                             setHomeNewsData(res.data.response);
//                         }
//                     })
//             }
//             getToken();
//         })
//     )

//     const favCrop = () => {
//         navigation.navigate('FavCrop')
//     }

//     const news = () => {
//         navigation.navigate('News')
//     }

//     return (
//         <>
//             <ScrollView>
//                 <View >
//                     <View style={{ flexDirection: 'row', }}>
//                         {
//                             addedCropData.length ?
//                                 addedCropData.slice(-4).map((item, index) => (
//                                     <HomeAddedCrop item={item} key={index} navigation={navigation} />
//                                 ))
//                                 :
//                                 <View style={{ flex: 1, marginLeft: 20, paddingTop: 20 }}>
//                                     <View>
//                                         <Image source={require('../assets/addMoreCrop.png')} style={styles.image} onPress={() => { favCrop() }} />
//                                     </View>
//                                     <Text style={styles.paragraph} onPress={() => { favCrop() }}>Add Crops</Text>
//                                 </View>
//                         }
//                     </View>
//                     {
//                         addedCropData.length ?
//                             <View style={{ flexDirection: 'row-reverse', marginTop: 10, marginHorizontal: 30 }}>
//                                 <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.secondary }} onPress={() => { favCrop() }}>See more...</Text>
//                             </View>
//                             : <View></View>
//                     }
//                 </View>
//                 <View style={{ marginBottom: 10 }}>
//                     <View>
//                         {
//                             homeNewsData.slice(-3).map((newsitem, index) => (
//                                 <HomeNews newsitem={newsitem} key={index} navigation={navigation} />
//                             ))
//                         }
//                     </View>
//                     <View style={{ flexDirection: 'row-reverse', marginTop: 10, marginHorizontal: 30 }}>
//                         <Text style={{ fontSize: 15, fontWeight: '600', color: Colors.secondary }} onPress={() => { news() }}>See more...</Text>
//                     </View>
//                 </View>
//             </ScrollView>
//         </>
//     )
// }

// const styles = StyleSheet.create({
//     image: {
//         width: 70,
//         height: 70,
//         borderRadius: 100,
//         // backgroundColor: "#fff",
//         // flexDirection: 'row'
//     },
//     newsimage: {
//         // width: 100,
//         // height: 100,
//     },
//     crop_image: {
//         width: 40,
//         height: 40,
//         borderRadius: 100,
//     },
//     mainContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     subContainer: {
//         flexDirection: 'row',
//     },
// })

// export default HomeScreen;