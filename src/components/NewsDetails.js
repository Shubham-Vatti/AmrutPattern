import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, ScrollView, ToastAndroid, Dimensions, Modal, Alert, TouchableOpacity } from 'react-native';
// import { Card } from 'react-native-elements';
import { Card } from '@rneui/themed';
import RenderHTML from 'react-native-render-html';
import { InstagramLoader } from "react-native-easy-content-loader";
import Config from 'react-native-config';
import { Colors } from '../constants/Theme';
// import VideoPlayer from 'react-native-video-player';
import { AuthContext } from '../../App';
import Pdf from 'react-native-pdf';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'

const NewsDescription = ({ item }) => {
    const { width } = useWindowDimensions();
    const [isVisible, setIsVisible] = useState(false)
    // const  = props;
    // console.log("newsData", item)
    return (
        <>
            <View style={{ backgroundColor: Colors.bodybackground, flex: 1 }} >
                <Card style={{ flex: 1 }}>
                    <View style={styles.mainContainer}>
                        <View style={styles.subContainer} >
                            <Image source={(item.crop_image == null) ? require('../assets/defaultCrop.png') : { uri: item.crop_image }} style={styles.crop_image} />
                            <Text style={{ fontSize: 18, fontWeight: '500', padding: 5, }}> {item.crop_name} </Text>
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: '500', padding: 5, textAlign: 'right', }}> {item.news_date} </Text>
                    </View>

                    <Text style={{ fontSize: 18, fontWeight: '500', paddingBottom: 5 }}>{item.title}</Text>
                    <Card.Image source={(item.image == null) ? require('../assets/defaultCrop.png') : { uri: item.image }} />
                    <RenderHTML contentWidth={width} source={{ html: item.description }} />
                    {
                        (item.video && item.video != null) &&<></>
                        // <VideoPlayer
                        //     // resizeMode='cover'
                        //     autoplay={false}
                        //     defaultMuted={true}
                        //     video={{ uri: item.video }}
                        //     videoWidth={1600}
                        //     videoHeight={900}
                        //     thumbnail={require('../assets/defaultCrop.png')}
                        // />
                    }
                    <Text style={{ fontSize: 14, fontWeight: '500', padding: 5, textAlign: 'right', }}>{item.news_date}</Text>
                </Card>
                {
                    (item.pdf && item.pdf != null) &&
                    <Card>
                        <TouchableOpacity activeOpacity={0.8} style={styles.viewpdf} onPress={() => { setIsVisible(true) }}>
                            <Image source={require('../assets/pdflogo.png')} style={{ height: 80, width: 50 }} resizeMode={'contain'} />
                            <Text style={{ fontSize: 18, fontWeight: '600', alignItems: 'center' }} >Press to open document</Text>
                        </TouchableOpacity>
                    </Card>
                }
                <Modal
                    visible={isVisible}
                    onRequestClose={() => {
                        setIsVisible(false)
                    }}
                >
                    <View style={styles.container}>
                        <Pdf
                            source={{ uri: item.pdf, cache: true }}
                            onLoadComplete={(numberOfPages, filePath) => {
                                console.log(`Number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                console.log(`Current page: ${page}`);
                            }}
                            onError={(error) => {
                                console.log(error);
                            }}
                            onPressLink={(uri) => {
                                console.log(`Link pressed: ${uri}`);
                            }}
                            trustAllCerts={false}
                            style={styles.pdf} />
                    </View>
                </Modal>
                <View style={{marginTop: 15, marginBottom: 15, alignItems: 'center' }}>
                    <BannerAd
                        unitId={`ca-app-pub-1395130423965461/3892396321`}
                        size={BannerAdSize.MEDIUM_RECTANGLE}
                        requestOptions={{
                            requestNonPersonalizedAdsOnly: true
                        }}
                    />
                </View>
            </View>
        </>
    )
}


function NewsDetails({ route }) {
    const { news_id } = route.params;
    console.log(news_id);

    const [loading, setLoading] = useState(false);
    const [newsData, setNewsData] = useState({});
    const { signOut, language, isNetworkAvailable ,AppVersion} = useContext(AuthContext);
    useEffect(() => {
        const getToken = async () => {
            if (news_id) {
                let checkToken = await AsyncStorageLib.getItem("amrut_session");
                if (checkToken == null) {
                    signOut();
                    return;
                }

                const getNewsDetailApiUrl = `${Config.API_BASE_URL}/news/detail/${news_id}?language=${language}&version=${AppVersion}`;
                axios
                    .get(getNewsDetailApiUrl, { headers: { 'Authorization': checkToken } })
                    .then((res) => {
                        // console.log(res.data);
                        if (res.data.success == true) {
                            setNewsData(res.data.response);
                        } else {
                            ToastAndroid.show("Somthing went wrong", ToastAndroid.LONG, ToastAndroid.CENTER)
                        }
                        setLoading(true);
                    })
            }
        }
        getToken();
    }, [news_id, isNetworkAvailable]);
    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.bodybackground }}>
            {
                loading ?
                    <NewsDescription item={newsData} />
                    :
                    <>
                        <InstagramLoader active />
                    </>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 70,
        height: 70,
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
        marginBottom: 10,
    },
    subContainer: {
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    viewpdf: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center',
    }
})

export default NewsDetails;