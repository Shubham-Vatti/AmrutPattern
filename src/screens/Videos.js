import AsyncStorageLib from '@react-native-async-storage/async-storage';
import React, { useCallback } from 'react'
import { ActivityIndicator, Image, FlatList, Text, View, TouchableOpacity, ToastAndroid, RefreshControl } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons';
import Config from 'react-native-config';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../App';
import { FavCropCard, HomeCrop } from '../components/Widget';
import { useFocusEffect } from '@react-navigation/native';
import { FacebookLoader } from 'react-native-easy-content-loader';
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Theme';
import { translator } from '../locales/I18n';

const Videos = ({ navigation, route }) => {
    const { signOut, language, isNetworkAvailable,AppVersion } = useContext(AuthContext);
    const [videos, setVideos] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isCropLoading, setCropLoading] = useState(true);
    const [addedCropData, setAddedCropData] = useState(0)
    const [selectedCrops, setSelectedCrops] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const getToken = async () => {
                let checkToken = await AsyncStorageLib.getItem('amrut_session');
                if (checkToken == null) {
                    signOut();
                    return;
                }

                setLoading(true);

                const videoGetApiUrl = `${Config.API_BASE_URL}/videos?language=${language}&version=${AppVersion}`;
                axios
                    .get(videoGetApiUrl, { headers: { Authorization: checkToken } })
                    .then(res => {
                        setLoading(false);
                        if (res.data.success == true) {
                            setVideos(res.data.response);
                        } else {
                            ToastAndroid.show(
                                'Something went wrong',
                                ToastAndroid.LONG,
                                ToastAndroid.BOTTOM,
                            );
                        }
                    }).catch(() => {
                        setLoading(false);
                    });
            };
            getToken();
        }, [language, isNetworkAvailable])
    )

    useFocusEffect(
        useCallback(() => {
            const getToken = async () => {
                let checkToken = await AsyncStorageLib.getItem("amrut_session");
                if (checkToken == null) {
                    signOut();
                    return;
                }
                setCropLoading(true);

                let apiParam = (selectedCrops > 0) ? `&crop_id=${selectedCrops}` : "";

                const favCropGetApiUrl = `${Config.API_BASE_URL}/customer-crops-list?language=${language}${apiParam}&version=${AppVersion}`;
                axios
                    .get(favCropGetApiUrl, { params: { offset: 0, limit: 5 }, headers: { 'Authorization': checkToken } })
                    .then((res) => {
                        setCropLoading(false);
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
                    })
                    .catch((er) => {
                        setCropLoading(false);
                        ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                    })
            }
            getToken();
        }, [isNetworkAvailable, selectedCrops])
    )

    const fileOpen = videoId => {
        navigation.navigate('Video View', {
            video_id: videoId,
        });
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
          setRefreshing(false);
        }, 1600);
      }, []);

    const onClickCrop = (crop_id) => {
        setSelectedCrops(crop_id);
    }

    return (
        <>
            {
                !isCropLoading ?
                    <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        {(addedCropData.length>1)&&<TouchableOpacity
                            onPress={() => onClickCrop(0)}
                            activeOpacity={.8}
                        >
                            <View style={styles.newsAllbtnCircle}>
                                <View style={[styles.videoAllbtn, selectedCrops === 0 ? styles.videoDefaultbtn : styles.videoActiveAllbtn]}>
                                    <Text style={{ fontSize: 18, color: Colors.white, fontWeight: '600' }}>All</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 14, textAlign: "center", paddingTop: 5 }} numberOfLines={1} >{translator("home.all_crops", language)}</Text>
                        </TouchableOpacity>}
                        <FlatList
                            data={addedCropData}
                            renderItem={({ item }) =>{
                                return <FavCropCard item={item} navigation={navigation} cropClick={onClickCrop} selectedCrops={selectedCrops} />}
                            }
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    :
                    <FacebookLoader active />
            }
            {
                isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <ActivityIndicator size={60} color={Colors.secondary} />
                    </View>
                    :
                    videos.length ?
                        <FlatList
                        refreshControl={
                            <RefreshControl
                            refreshing={refreshing}
                            onRefresh={()=>onRefresh()}
                            />
                        }
                            data={videos}
                            // horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 6 }}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    index={index}
                                    style={{ marginHorizontal: 6, marginVertical: 6 }}
                                    onPress={() => {
                                        fileOpen(item.id);
                                    }}
                                >
                                    <View style={{ borderWidth: 2, borderColor: 'rgba(0,0,0,0.1)', padding: 5, position: 'relative' }}>
                                        <TouchableOpacity
                                            activeOpacity={0.5}
                                            style={{ position: 'absolute', left: '45%', top: '26%' }}
                                            onPress={() => {
                                                fileOpen(1);
                                            }}
                                        >
                                            <Ionicon name="play-circle-sharp" size={55} color={'#ffff'} />
                                        </TouchableOpacity>
                                        <Image
                                            source={{ uri: item.image }}
                                            resizeMode={'cover'}
                                            style={{ width: "100%", height: 200, zIndex: -1 }}
                                        />
                                        <View style={{ marginBottom: 10 }}>
                                            <Text style={{ fontSize: 18, color: "black" }}>{item.title}</Text>
                                            <Text style={{ fontSize: 16 }}>{item.sub_title}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.5 }}>
                            <Ionicon name='videocam-outline' style={{ fontSize: 30 }}/>
                            <Text style={{ fontSize: 18 }}>{translator('video.no_video', language)}</Text>
                        </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    videoAllbtn: {
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
        borderRadius: 50,
        alignItems: 'center',
        marginHorizontal: 10,
        justifyContent: 'center',
        borderColor: Colors.green,
        backgroundColor: Colors.bodybackground,
        borderWidth: 4
    },
    videoActiveAllbtn: {
        height: 75,
        width: 75,
    },
    videoDefaultbtn: {
        height: 60,
        width: 60,
    }
})

export default Videos