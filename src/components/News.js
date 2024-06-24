import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Touchable, Circle, RefreshControl, ToastAndroid, useWindowDimensions, FlatList, Alert } from 'react-native';
// import { Card, Icon, } from 'react-native-elements';
import { Card } from '@rneui/themed';
import { Row, Col } from 'react-native-responsive-grid-system';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { FacebookLoader } from "react-native-easy-content-loader";
import Config from 'react-native-config';
import { Colors } from '../constants/Theme';
import { AuthContext } from '../../App';
import AdvertisementSection from './Advertisement';
import { HomeCrop } from './Widget';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import MobileAds, { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const NewsSection = ({ item, navigation }) => {
    const aboutNews = (item) => {
        navigation.navigate('News Description', {
            news_id: item
        })
    }
    return (
        <>
            <View style={{ backgroundColor: Colors.bodybackground, flex: 1 }}>
                <TouchableOpacity activeOpacity={1} onPress={() => { aboutNews(item.id) }}>
                    <Card>
                        <View style={styles.mainContainer}>
                            <View style={styles.subContainer} >
                                <Image source={(item.crop_image == null) ? require('../assets/defaultCrop.png') : { uri: item.crop_image }} style={styles.crop_image} />
                                <Text style={{ fontSize: 18, fontWeight: '500', padding: 5, }}> {item.crop_name} </Text>
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: '500', padding: 5, textAlign: 'right', }}> {item.news_date} </Text>
                        </View>
                        <View style={styles.pt8}>
                            <Image source={item.image !== "" ? { uri: item.image } : require('../assets/defaultCrop.png')} style={{ height: 150 }} />
                            <Text style={{ fontSize: 16, fontWeight: '500', paddingTop: 5 }}>{item.title}</Text>
                        </View>
                    </Card>
                </TouchableOpacity>
            </View>
        </>
    )
}



function News({ navigation, route }) {
    // console.log("lksdjf", route.params.crop_id)

    const [loading, setLoading] = useState(false);
    const [newsData, setNewsData] = useState([]);
    const { signOut, language, isNetworkAvailable,AppVersion } = useContext(AuthContext);
    const [refreshing, setRefreshing] = useState(false);
    const isFocused = useIsFocused();
    const [addedCropData, setAddedCropData] = useState(0)
    const [selectedCrops, setSelectedCrops] = useState(0);
    const [cropId, setCropId] = useState(route.params?.crop_id || 0);

    useFocusEffect(
        useCallback(() => {
            const getToken = async () => {
                // console.log("route",cropId)
                setCropId(route.params?.crop_id || 0);
                setSelectedCrops(route.params?.crop_id || 0);
                let checkToken = await AsyncStorageLib.getItem("amrut_session");
                if (checkToken == null) {
                    signOut();
                    return;
                }

                const favCropGetApiUrl = `${Config.API_BASE_URL}/customer-crops-list?language=${language}&version=${AppVersion}`;
                axios
                    .get(favCropGetApiUrl, { params: { offset: 0, limit: 5 }, headers: { 'Authorization': checkToken } })
                    .then((res) => {
                        // console.log("crops data", res.data)
                        if (res.data.success === true) {
                            setAddedCropData(res.data.response);
                        } else if (res.data.message && res.data.message == 'Unauthorized Access') {
                            setAddedCropData([]);
                            ToastAndroid.show("Your session is expired, please login again", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                            signOut();
                        } else {
                            setAddedCropData([]);
                            // ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                        }
                        setLoading(true);
                    })
                    .catch((er) => {
                        ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                    })
            }
            getToken();
        }, [isNetworkAvailable, route.param, isFocused])
    )
    // console.log(newsData.length)

    useEffect(() => {
        const getNews = async () => {
            // console.log("crop_id",cropId)
            let checkToken = await AsyncStorageLib.getItem("amrut_session");
            if (checkToken == null) {
                signOut();
                return;
            }
            let param = `language=${language}`;
            if (cropId > 0) {
                param += `&crop_id=${cropId}`;
            }
            // console.log("param =", param)
            const getNewsApiUrl = `${Config.API_BASE_URL}/news?${param}`
            axios.get(getNewsApiUrl, { headers: { 'Authorization': checkToken } })
                .then((res) => {
                    // console.log("News data",res.data)
                    if (res.data.success == true) {
                        let NewsData = res.data.response
                        let AdvertisementData = res.data.advertisement
                        let newData = [];
                        let adIndex = 0;
                        for (let i = 0; i < NewsData.length; i++) {
                            NewsData[i].type = "news";
                            newData.push(NewsData[i]);
                            if (i % 4 === 3) {
                                newData.push({ type: "google_ad" });
                            } else if (i % 2 === 1 && AdvertisementData.length >= adIndex + 1) {
                                AdvertisementData[adIndex].type = "ad";
                                newData.push(AdvertisementData[adIndex]);
                                adIndex++;
                            }
                        }
                        setNewsData(newData)
                    } else {
                        setNewsData([]);
                        ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
                    }
                    setLoading(true);
                }).catch(function (error) {
                    ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
                })
        }
        getNews();
    }, [refreshing, cropId, language])

    useEffect(() => {
        // initilization of google mob ads
        MobileAds().initialize();
    }, []);

    const cropClick = (crop_id) => {
        setSelectedCrops(crop_id);
        setCropId(crop_id);
    }


    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));

    }
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => {
            setRefreshing(false)
            ToastAndroid.show("Refreshed", ToastAndroid.LONG, ToastAndroid.TOP);
        });
    }, []);



    return (
        <View style={{ backgroundColor: Colors.bodybackground, flex: 1 }}>
            <ScrollView
            refreshControl={
                <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                />
            }
                // refreshControl={
                //     <RefreshControl
                //         refreshing={refreshing}
                //         onRefresh={onRefresh}
                //     />
                // }
            >
                {
                    loading ?
                        <View style={{ flexDirection: 'row' }}>
                            {(addedCropData.length>1)&&<TouchableOpacity
                                onPress={() => cropClick(0)}
                                activeOpacity={.8}
                                style={(selectedCrops == 0) ? styles.newsAllbtnCircle : null}
                            >
                                <View style={styles.newsAllbtn}>
                                    <Text style={{ fontSize: 18, color: Colors.white, fontWeight: '600' }}>All</Text>
                                </View>
                            </TouchableOpacity>}
                            <FlatList
                                data={addedCropData}
                                renderItem={({ item }) =>
                                    <HomeCrop item={item} navigation={navigation} cropClick={cropClick} selectedCrops={selectedCrops} />
                                }
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            // contentContainerStyle={{ paddingHorizontal: 0 }}
                            />
                        </View>
                        :
                        <FacebookLoader active />
                }
                <View style={{ flex: 1 }}>
                    {
                        loading ?
                            (newsData.length > 0) ?
                                newsData.map((item, index) => (
                                    <Col xs={12} key={index} >
                                        {
                                            item && (item.type == "news") ?
                                                <TouchableOpacity activeOpacity={.1} >
                                                    <NewsSection item={item} status="false" navigation={navigation} />
                                                </TouchableOpacity>
                                                : (item.type === 'google_ad')
                                                    ?
                                                    <View style={{ marginTop: 15, alignItems: 'center' }}>
                                                        <BannerAd
                                                            unitId={`ca-app-pub-1395130423965461/4815819541`}
                                                            size={BannerAdSize.MEDIUM_RECTANGLE}
                                                            requestOptions={{
                                                                requestNonPersonalizedAdsOnly: true
                                                            }}
                                                        />
                                                    </View>
                                                    : <AdvertisementSection item={item} />
                                        }
                                    </Col>
                                ))
                                :
                                <Text style={{ flex: 1, alignSelf: 'center', marginTop: '50%', fontSize: 20, color: Colors.black }}>No News</Text>
                            :
                            <>
                                <FacebookLoader active />
                                <FacebookLoader />
                                <FacebookLoader />
                                <FacebookLoader />
                            </>
                    }
                </View>

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 10,
        height: 10,
        borderRadius: 100,
    },
    crop_image: {
        width: 40,
        height: 40,
        borderRadius: 100,
    },
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subContainer: {
        flexDirection: 'row',
    },
    pt8: {
        paddingTop: 5
    },
    newsAllbtn: {
        height: 60,
        width: 60,
        marginVertical: 10,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondary,
        borderRadius: 50
    },
    newsAllbtnCircle: {
        height: 75,
        width: 75,
        // padding: 5,
        borderRadius: 50,
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
        justifyContent: 'center',
        borderColor: Colors.green,
        backgroundColor: Colors.bodybackground,
        borderWidth: 4
    }
})
export default News;