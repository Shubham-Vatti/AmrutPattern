import { View, Text, Image } from 'react-native'
import React from 'react'
// import { Card } from 'react-native-elements'
import { Colors } from '../constants/Theme'

const AdvertisementSection = ({ item }) => {
    // console.log("item", item)
    return (
        <>
            {
                item &&
                <View style={{marginHorizontal: 15, padding: 10, borderRadius: 10, backgroundColor: Colors.bodybackground, marginTop: 10, borderRadius: 20, borderWidth: 1}}>
                    <Text style={{ fontSize: 18, fontWeight: '500', paddingBottom: 5 }}>Advertisement</Text>
                    <Image source={{ uri: item.file }} style={{ width: '100%', height: 150, resizeMode: 'stretch' }} />
                </View>
            }
        </>
    )
}

export default AdvertisementSection