import React from 'react'
import { Text, ToastAndroid, TouchableOpacity, View, ActivityIndicator, Image, StyleSheet } from "react-native"
// import { Image } from 'react-native-elements'
import DefaultImage from '../assets/defaultCrop.png'
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../constants/Theme';

const HomeCrop = (props) => {
    const { item, navigation, index, cropClick, selectedCrops } = props;
    // console.log("home screen crops", selectedCrops)

    const CropDetails = (item, itemimage, title) => {
        navigation.navigate('About Crop', {
            crop_id: item,
            crop_image: itemimage,
            Crop_title: title
        })
    }


    const noSubscribe = () => {
        ToastAndroid.showWithGravityAndOffset(
            'You don`t have subscription for this crops, please subscribe for more details',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            200
        );
    };
    return (
        <View style={{ marginTop: (index === item.length - 1) ? 0 : 10, marginBottom: (index === item.length - 1) ? 0 : 10, }}>
            <TouchableOpacity
                activeOpacity={0.8}
                style={{ width: (selectedCrops == item.crop_id) ? 'auto' : 75, height: 100, marginHorizontal: 5, alignItems: 'center' }}
                onPress={item.subscriptionDaysLeft > 0 ? () => cropClick(item.crop_id) : () => noSubscribe()}
            >
                <View style={(selectedCrops == item.crop_id) ? { width: 75, height: 60, borderRadius: 50, borderWidth: 3, borderColor: Colors.green, padding: 3, flex: 1 } : { height: 60, width: 60 }}>
                    <Image
                        defaultSource={DefaultImage}
                        source={item.image !== "" ? { uri: item.image } : require('../assets/defaultCrop.png')}
                        style={{ height: 60, width: 60, borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignContent: 'center', flex: 1 }}
                        resizeMode={'cover'}
                    />
                </View>
                <Text style={{ fontSize: 14, textAlign: "center", paddingTop: 5 }} numberOfLines={1} >{item.title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export const FavCropCard = (props) => {
    const { item, navigation, index, cropClick, selectedCrops } = props;

    const noSubscribe = () => {
        ToastAndroid.showWithGravityAndOffset(
            'You don`t have subscription for this crops, please subscribe for more details',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            200
        );
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            style={{ height: 96, width: 75, marginHorizontal: 10 }}
            onPress={item.subscriptionDaysLeft > 0 ? () => cropClick(item.crop_id) : () => noSubscribe()}
        >
            <View style={[styles.crops, selectedCrops === item.crop_id ? { borderWidth: 4 } : null]}>
                <Image
                    defaultSource={DefaultImage}
                    source={item.image !== "" ? { uri: item.image } : require('../assets/defaultCrop.png')}
                    resizeMode={'cover'}
                    style={[selectedCrops === item.crop_id ? styles.cropActiveImg : styles.cropImg]}
                />
            </View>
            <Text style={{ fontSize: 14, textAlign: "center", paddingTop: 5 }} numberOfLines={1} >{item.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    icon: {
        position: 'absolute',
        justifyContent: 'center',
        alignSelf: 'center',
        top: 25,
        color: "#fff"
    },
    crops: {
        height: 75,
        width: 75,
        borderColor: Colors.green,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:3
    },
    cropActiveImg: {
        height: 60,
        width: 60,
        borderRadius: 30
    },
    cropImg: {
        width: 74,
        height: 74,
        borderRadius: 50
    }
})

export { HomeCrop };