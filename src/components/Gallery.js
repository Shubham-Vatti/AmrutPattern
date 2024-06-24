import React, { lazy, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Button, ToastAndroid, FlatList } from 'react-native';
// import { Card, Image } from 'react-native-elements';
import { Card ,Image} from '@rneui/themed';
import { AuthContext } from '../../App';
import axios from 'axios';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import { Col, Row } from 'react-native-responsive-grid-system';
// import FastImage from 'react-native-fast-image'
import Swiper from 'react-native-swiper';
import Ionicon from 'react-native-vector-icons/Ionicons';

const GallImag = ({ item, ActivityIndicator, index, setmodalimg }) => {
    // console.log("item.image", item.image)

    return (
        // <Image source={require('../assets/farmer.jpg')} style={{height: 200, width: '100%'}} />
        <View style={{ flex: 1 }}>
            {/* <Swiper>
                <Image source={{ uri: item.image }} style={{ height: 150, width: '100%' }} />
            </Swiper> */}
            <Card containerStyle={{ margin: 5, marginBottom: 10 }}>
                <Card.Image
                    source={{ uri: item.image }}
                    style={{ width: '100%', height: 160 }}
                    PlaceholderContent={ActivityIndicator}
                    onPress={() => { setmodalimg(index) }}
                />
                {/* <Image source={{ uri: item.image }} style={{ height: 400, width: '100%' }} /> */}

            </Card>

        </View>
    )
}

const Gallery = () => {

    const [galleryData, setGalleryData] = useState([]);
    const { signOut, language, isNetworkAvailable ,AppVersion} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [modalimg, setmodalimg] = useState(null);

    useEffect(() => {
        const getToken = async () => {
            let checkToken = await AsyncStorageLib.getItem("amrut_session");
            if (checkToken == null) {
                signOut();
                return;
            }
            const getApiUrl = `${Config.API_BASE_URL}/gallery?language=${language}&version=${AppVersion}`;
            axios.get(getApiUrl, { headers: { 'Authorization': checkToken } })
                .then((res) => {
                    if (res.data.success == true) {
                        setGalleryData(res.data.response);
                    } else {
                        setGalleryData([]);
                        ToastAndroid.show("No images found", ToastAndroid.LONG, ToastAndroid.CENTER);
                    }
                    setLoading(true);
                }).catch(function (error) {
                    ToastAndroid.show("Somthing went Wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
                })
        }
        getToken();
    }, [isNetworkAvailable]);

    return (
        <>
            <View style={{ flex: 1 }}>
                {
                    loading ?

                        <FlatList
                            data={galleryData}
                            numColumns={2}
                            renderItem={({item, index})=>(
                                <GallImag item={item} index={index} setmodalimg={setmodalimg} ActivityIndicator={<ActivityIndicator size={"large"} />} />
                            )}
                        />

                        // <ScrollView >
                        //     <Row>
                        //         {
                        //             galleryData.map((item, index) => (
                        //                 <Col xs={6} key={index}>
                        //                     <GallImag item={item} index={index} setmodalimg={setmodalimg} ActivityIndicator={<ActivityIndicator size={"large"} />} />
                        //                 </Col>
                        //             ))
                        //         }
                        //     </Row>
                        // </ScrollView >
                        :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size={"large"} />
                        </View>
                }
            </View>
            <Modal
                transparent={true}
                visible={(modalimg === null) ? false : true}
                onRequestClose={() => {
                    setmodalimg(null)
                }}
                animationType="fade"
            >
                <View style={{ backgroundColor: '#000000aa', flex: 1, justifyContent: "center" }}>
                    <View style={{ backgroundColor: '#ffff', height: 249 }}>
                        <Swiper
                            autoplay={false}
                            showsPagination={false}
                            loadMinimalLoader={<ActivityIndicator size={"large"} />}
                            index={modalimg}
                        >
                            {
                                galleryData.map((item, index) => (
                                    <Image key={index} source={{ uri: item.image }} style={{ height: 250, width: '100%', resizeMode: "stretch" }} />
                                ))
                            }
                        </Swiper>
                    </View>
                    <TouchableOpacity style={styles.closeBtn} activeOpacity={1} onPress={() => setmodalimg(null)}>
                        <Ionicon name="close-circle-outline" color={"#fff"} size={40} />
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    )
}

const styles = {
    closeBtn: {
        position: "absolute",
        top: 10,
        right: 10
    }
}

export default Gallery;