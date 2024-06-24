import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback, useContext, useState, useEffect } from 'react'
import { Image, ScrollView, Text, ToastAndroid, TouchableOpacity, View, RefreshControl, BackHandler, FlatList } from 'react-native'
import { AuthContext } from '../../App';
import NewsCard from '../components/NewsCard';
import { HomeCrop } from '../components/Widget';
import { Colors } from '../constants/Theme';
import ContentLoader, { FacebookLoader, InstagramLoader, Bullets } from "react-native-easy-content-loader";
import Config from 'react-native-config';
import { translator } from '../locales/I18n';
import HomeGallery from './HomeGallery';
import AdvertisementSection from '../components/Advertisement';
import MobileAds, { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import HomeScreenVideo from './HomeScreenVideo';

const HomeScreen = ({ navigation }) => {
    const { signOut, language, isNetworkAvailable,AppVersion } = useContext(AuthContext);
    const [addedCropData, setAddedCropData] = useState([]);
    const [homeNewsData, setHomeNewsData] = useState([]);
    const [loading, setloading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [exitApp, setExitApp] = useState(0);

    useEffect(() => {
        // initilization of google mob ads
        MobileAds().initialize();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const getToken = async () => {
                let checkToken = await AsyncStorageLib.getItem("amrut_session");

                if (checkToken == null) {
                    signOut();
                    return;
                }

                const favCropGetApiUrl = `${Config.API_BASE_URL}/customer-crops-list?language=${language}&version=${AppVersion}`;
                axios
                    .get(favCropGetApiUrl, { params: { offset: 0, limit: 5 }, headers: { 'Authorization': checkToken } })
                    .then((res) => {
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
                        setloading(true);
                    })
                    .catch((er) => {
                        ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                    })

                const getNewsApiUrl = `${Config.API_BASE_URL}/news?language=${language}&version=${AppVersion}`;
                axios
                    .get(getNewsApiUrl, { params: { offset: 0, limit: 10 }, headers: { 'Authorization': checkToken } })
                    .then((res) => {
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
                            setHomeNewsData(newData);
                        } else {
                            setHomeNewsData([]);
                        }
                    })
                    .catch((er) => {
                        setHomeNewsData([]);
                        ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                    })
            }
            getToken();

        }, [refreshing, isNetworkAvailable, language])
    )

    // Pull Down refresh start
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then((e) => {
            setRefreshing(false)
            ToastAndroid.show("Refreshed", ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        );
    }, []);
    // pull Down refresh end

    // double tap back button to exit App, start here
    const backAction = () => {
        setTimeout(() => {
            setExitApp(0);
        }, 2000); // 2 seconds to tap second-time

        if (exitApp === 0) {
            setExitApp(exitApp + 1);
            ToastAndroid.show("tap again to exit the App", ToastAndroid.SHORT);
        } else if (exitApp === 1) {
            BackHandler.exitApp();
        }
        return true;
    };

    // double tap back button to exit App, end here
    useFocusEffect(
        useCallback(() => {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            return () => backHandler.remove();
        })
    )

    const cropClick = (crop_id) => {
        // console.log("crop id", crop_id)
        navigation.navigate('News', {
            crop_id: crop_id
        })
    }

    return (
        <>
            <ScrollView style={{ flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >

                <View style={{ backgroundColor: Colors.bodybackground }}>
                    {
                        (addedCropData.length > 0) ?
                            <View>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, paddingHorizontal: 15 }}>
                                    <Text style={{ fontSize: 18, color: "#000", fontWeight: "600" }}>{translator("home.fav_crop", language)}</Text>
                                    <Text style={{ fontSize: 14, color: Colors.secondary, textAlignVertical: "bottom" }} onPress={() => (navigation.navigate("FavCrop"))}>{translator("home.see_more", language)}</Text>
                                </View>
                                {
                                    loading ?
                                        <FlatList
                                            data={addedCropData}
                                            renderItem={({ item, index }) =>
                                                <HomeCrop item={item} index={index} navigation={navigation} cropClick={cropClick} />
                                            }
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={{ paddingHorizontal: 15 }}
                                        />
                                        :
                                        <FacebookLoader active />
                                }
                            </View>
                            :
                            <></>
                    }
                    
                    <HomeGallery navigation={navigation}/>
                    
                    <HomeScreenVideo navigation={navigation} />

                    <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 20, paddingHorizontal: 15 }}>
                        <Text style={{ fontSize: 18, color: "#000", fontWeight: "600" }}>{translator("home.news", language)}</Text>
                        <Text style={{ fontSize: 14, color: Colors.secondary, textAlignVertical: "bottom" }} onPress={() => (navigation.navigate("News"))}>{translator("home.see_more", language)}</Text>
                    </View>

                    {
                        loading ?
                            <View>
                                {
                                    (homeNewsData.length > 0) ?
                                        homeNewsData.map((item, index) => (
                                            <View key={index}>
                                                {
                                                    item && (item.type == "news") ?
                                                        <NewsCard
                                                            key={index}
                                                            item={item}
                                                            navigation={navigation}
                                                            style={{ marginBottom: (homeNewsData.length - 1 === index) ? 15 : 0 }}
                                                        />
                                                        : (item.type === 'google_ad')
                                                            ?
                                                            <View style={{ marginTop: 15, alignItems: 'center' }}>
                                                                <BannerAd
                                                                    unitId={`ca-app-pub-1395130423965461/3616372222`}
                                                                    size={BannerAdSize.MEDIUM_RECTANGLE}
                                                                    requestOptions={{
                                                                        requestNonPersonalizedAdsOnly: true
                                                                    }}
                                                                />
                                                            </View>
                                                            : <AdvertisementSection key={index} item={item} />
                                                }
                                            </View>
                                        ))
                                        : null
                                }
                            </View>
                            :
                            <FacebookLoader active />
                    }
                </View>
            </ScrollView>
        </>
    )
}

export default HomeScreen;
