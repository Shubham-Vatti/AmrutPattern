import React, { createContext, useCallback } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text, View, Image } from 'react-native';
import CropProtection from './CropProtection'
import PackageOfPractices from './PackageOfPractices';
import { useFocusEffect } from '@react-navigation/native';

const TabBarTop = createMaterialTopTabNavigator();

// const cardDetails = [
//     {
//         imgUrl: require('../assets/WheatImage/Smut.jpg')
//     }
// ]

const SingleImage = ({ item }) => {
    return (
        <View>
            <Image source={{ uri: item }} style={{ height: 150, width: '100%' }} />
        </View>
    )
}

const CropData = createContext(null);

const CropDetails = ({ route, navigation }) => {
    // console.log(route)
    const { crop_id, crop_image } = route.params;
    //   console.log(crop_id);
    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({ title: route.params.Crop_title })
        })
    )

    return (<>
        {/* <ScrollView style={{flex:1}}> */}
        <View>
            {/* {cardDetails.map((item,index) => ( */}
            <SingleImage item={crop_image} />
            {/* ))} */}
        </View>
        <CropData.Provider value={route.params.crop_id}>
            <TabBarTop.Navigator
                screenOptions={{
                    // tabBarScrollEnabled: true,
                    // tabBarItemStyle: { width: '100%' },
                    tabBarLabelStyle: {
                        height: 1
                    }
                }}
                initialRouteName='Crop Protection'
            >
                <TabBarTop.Screen name='Crop Protection' component={CropProtection} options={{
                    tabBarLabel: ({ focused, color }) => (
                        <View style={{ flexDirection: "column", fontSize: 20, alignItems: 'center' }}>
                            <Ionicons name="hand-heart" color={color} size={20} />
                            <Text style={{ paddingStart: 5, fontSize: 18 }}>Crop Protection</Text>
                        </View>
                    ),

                }}
                />
                <TabBarTop.Screen name='Package of Practice' component={PackageOfPractices} options={{
                    tabBarLabel: ({ focused, color }) => (
                        <View style={{ flexDirection: "column", fontSize: 20, alignItems: 'center' }}>
                            <Ionicons name="flower" color={color} size={20} />
                            <Text style={{ paddingStart: 5, fontSize: 18 }}>Package of Practice</Text>
                        </View>
                    )
                }}
                />

            </TabBarTop.Navigator>
        </CropData.Provider>
        {/* </ScrollView> */}
    </>
    )
}
export default CropDetails;

export { CropData };