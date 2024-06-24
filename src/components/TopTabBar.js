import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CarouselCards from '../CardView/CarouselCards';
import { Text, View } from 'react-native';

const TabBarTop = createMaterialTopTabNavigator();

const TopTabBar = () => {
    return (
        <TabBarTop.Navigator
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarItemStyle: { width: 110 },
                tabBarLabelStyle:{
                    height:1
                }
            }}
            initialRouteName='HomeBar'
        >
            <TabBarTop.Screen name='HomeBar' component={CarouselCards} options={{
                tabBarLabel:({ focused, color })=>(
                    <View style={{ flexDirection:"row", fontSize:20 }}>
                        <Ionicons name="home" color={color} size={20} />
                        <Text style={{ paddingStart:5, fontSize:18 }}>Home</Text>
                    </View>
                )
            }} />
            <TabBarTop.Screen name='Feed' component={CarouselCards} options={{
                tabBarLabel:({ focused, color })=>(
                    <View style={{ flexDirection:"row", fontSize:20 }}>
                        <Ionicons name="file-tray-full-outline" color={color} size={20} />
                        <Text style={{ paddingStart:5, fontSize:18 }}>Feed</Text>
                    </View>
                )
            }} />
            <TabBarTop.Screen name='News' component={CarouselCards} options={{
                tabBarLabel:({ focused, color })=>(
                    <View style={{ flexDirection:"row", fontSize:20 }}>
                        <Ionicons name="newspaper-outline" color={color} size={20} />
                        <Text style={{ paddingStart:5, fontSize:18 }}>News</Text>
                    </View>
                )
            }} />
            <TabBarTop.Screen name='Farm' component={CarouselCards} options={{
                tabBarLabel:({ focused, color })=>(
                    <View style={{ flexDirection:"row", fontSize:20 }}>
                        <Ionicons name="newspaper-outline" color={color} size={20} />
                        <Text style={{ paddingStart:5, fontSize:18 }}>Farm</Text>
                    </View>
                )
            }} />
        </TabBarTop.Navigator>
    )
}

export default TopTabBar
