import React, { useState, useEffect, useContext, useCallback } from 'react';
import {Text ,View, ScrollView, StyleSheet, Button, Alert, TouchableOpacity, Image, ToastAndroid, useWindowDimensions, RefreshControl } from 'react-native';
// import { , Card, } from 'react-native-elements';
// import Unorderedlist from 'react-native-unordered-list';
import { Row, Col } from 'react-native-responsive-grid-system';
// import { SearchBar } from 'react-native-elements';
import { CropData } from './CropDetails';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../App';
import axios from 'axios';
import RenderHTML from 'react-native-render-html';
import Config from 'react-native-config';



const PackageOfPractices = (route) => {
    const crop_id = useContext(CropData);
    // const { crop_id } = route.params;
    console.log("My crop id is ", crop_id);

    const { width } = useWindowDimensions();
    const { signOut, isNetworkAvailable } = useContext(AuthContext);
    const [practiceData, setPracticeData] = useState([]);
	const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {

        const getToken = async () => {
            let checkToken = await AsyncStorageLib.getItem("amrut_session");
            if (checkToken == null) {
                signOut();
                return;
            }
            const getPackagePracticeApiUrl = `${Config.API_BASE_URL}/package-practice/list/${crop_id}`;
            axios
                .get(getPackagePracticeApiUrl, { headers: { 'Authorization': checkToken } })
                .then((res) => {
                    console.log(res.data)
                    if (res.data.success == true) {
                        setPracticeData(...res.data.response);
                    } else {
                        // ToastAndroid.show("Somthing went wrong", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                    }
                })
                .catch((e) => {
                    ToastAndroid.show("Somthing went wrong", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                })
        }
        getToken();
    }, [crop_id, refreshing, isNetworkAvailable]);
    // console.log("practiceData ", practiceData.expectation);

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
        <ScrollView style={{ paddingBottom: 15 }}
        refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        }
        >
            <View style={styles.subDiv}>
                <Text style={styles.heading}>Expectation </Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.expectation }} />
                {/* <View style={{ flexDirection: 'row' }}>
                    <View style={styles.tab1}>
                        <Text style={{height: 60,...styles.lefttabvalue}}>AmrutPattern Smart farming</Text>
                        <Text style={styles.small}>Expected Fertilizer and Agrochemical Expenditure</Text>
                        <Text style={styles.lefttabvalue}>8,500</Text>
                        <View style={styles.underline}  />
                        <Text style={styles.small}>Expected Harvest</Text>
                        <Text style={styles.lefttabvalue}>25 Quinral/acre</Text>
                        <View style={styles.underline}  />
                        <Text style={styles.small}>Expected Income (Rs.)</Text>
                        <Text style={styles.lefttabvalue}>65,500</Text>
                    </View>
                    <View style={styles.tab2}>
                        <Text style={{height: 60,...styles.righttabvalue}}>Standerd farming</Text>
                        <Text style={styles.small}>Expected Fertilizer and Agrochemical Expenditure</Text>
                        <Text style={styles.righttabvalue}>11,500</Text>
                        <View style={styles.underline}  />
                        <Text style={styles.small}>Expected Harvest</Text>
                        <Text style={styles.righttabvalue}>19 Quinral/acre</Text>
                        <View style={styles.underline}  />
                        <Text style={styles.small}>Expected Income (Rs.)</Text>
                        <Text style={styles.righttabvalue}>47,500</Text>
                    </View>
                </View> */}

            </View>
            <View style={styles.subDiv}>
                <Text style={styles.heading}>Favourable Climate</Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.favourable_climate }} />
                {/* <Image source={require('../assets/WheatImage/Smut.jpg')} style={styles.imageset} />
                <Text style={styles.subheading}>Climate</Text>
                <Unorderedlist><Text>Wheat is a rabi season crop.</Text></Unorderedlist>
                <Unorderedlist><Text>The cool and sunny winters are very conductive for growth of wheat crop.</Text></Unorderedlist>
                <Unorderedlist><Text>For getting higher yeild it requires at least 100 cold day.</Text></Unorderedlist>

                <Text style={styles.subheading}>Temperature</Text>
                <Unorderedlist><Text>Weather that is comfortable for humans is also good for wheat.</Text></Unorderedlist>
                <Unorderedlist><Text>Wheat needs 12 to 15 inches (31 to 38 centimeters) of water to produce a good crop. </Text></Unorderedlist>
                <Unorderedlist><Text>At the time of germination it requires mean daily temperature between 20 to 25° C.</Text></Unorderedlist>

                <Text style={styles.subheading}>Crop Water Requirement</Text>
                <Unorderedlist><Text>Equivalent to 450-650 mm of rainfull.</Text></Unorderedlist> */}
            </View>

            <View style={styles.subDiv}>
                <Text style={styles.heading}>Favourable Soil</Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.favourable_soil }} />
                {/* <Image source={require('../assets/WheatImage/soil-test.jpg')} style={styles.imageset} />
                <Text style={styles.subheading}>Type</Text>
                <Unorderedlist><Text>Wheat can be grow on all kinds of soils, except the highly deteriorated alkaline and water logged soil</Text></Unorderedlist>
                <Unorderedlist><Text>Soil wth clay loam or loam texture, good structure and moderate water holding capacity are ideal for eheat cultivation.</Text></Unorderedlist>
                
                <Text style={styles.subheading}>pH</Text>
                <Unorderedlist><Text>Require range- 6.0-7.0</Text></Unorderedlist>
                <Unorderedlist><Text>If pH is {'<'} 6.0 add Lime</Text></Unorderedlist>
                <Unorderedlist><Text>If pH is {'>'} 7.0 add Gupsum</Text></Unorderedlist> */}
            </View>
            <View style={styles.subDiv}>
                <Text style={styles.heading}>Planting Material</Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.planting_material }} />
            </View>
            <View style={styles.subDiv}>
                <Text style={styles.heading}>Snowing</Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.sowing }} />
            </View>
            <View style={styles.subDiv}>
                <Text style={styles.heading}>Land Prepration</Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.land_preparation }} />
            </View>
            <View style={styles.subDiv}>
                <Text style={styles.heading}>Spacing and Plant Population</Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.spacing_plant_population }} />
            </View>
            <View style={styles.subDiv}>
                <Text style={styles.heading}>Nutrient Management</Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.nutrient_management }} />
            </View>
            <View style={styles.subDiv}>
                <Text style={styles.heading}>Irrigation</Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.irrigation }} />
            </View>
            <View style={styles.subDiv}>
                <Text style={styles.heading}>Intercultural Operations</Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.intercultural_operations }} />
            </View>
            <View style={styles.subDiv}>
                <Text style={styles.heading}>harvesting</Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.harvesting }} />
            </View>
            <View style={styles.subDiv}>
                <Text style={styles.heading}>Yield</Text>
                <RenderHTML contentWidth={width} source={{ html: practiceData.yield }} />
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    tab1: {
        flex: 1,
        height: 100,
        // width: '50%'
    },
    tab2: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    lefttabvalue: {
        // width: '50%',
        textAlign: 'center',
        padding: 5,
        margin: 5,
        fontSize: 18,
        // height: 55,
        color: 'green',
    },
    righttabvalue: {
        textAlign: 'center',
        padding: 5,
        margin: 5,
        fontSize: 18,
        // height: 55,
        justifyContent: 'center'
    },
    small: {
        fontSize: 13,
        // width: '50%',
        color: 'rgba(0,0,0,0.4)',
        textAlign: 'center'
    },
    underline: {
        borderBottomColor: 'rgba(0,0,0,0.3)',
        borderBottomWidth: 1,
        margin: 5
    },
    imageset: {
        height: 250,
        width: '100%'
    },
    heading: {
        fontSize: 20,
        marginVertical: 10,
        // marginHorizontal: 10,
    },
    subheading: {
        fontSize: 18,
        padding: 5
        // fontWeight: '500'

    },
    subDiv: {
        backgroundColor: "#fff",
        // marginVertical: 10, 
        marginBottom: 5,
        padding: 10
    }

})

export default PackageOfPractices;