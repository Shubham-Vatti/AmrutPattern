import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import NetInfo from "@react-native-community/netinfo";
import { Colors } from '../constants/Theme';

const NetworkErr = ({ dispatch }) => {
    const [checkNet, setCheckNet] = useState(false);
    useEffect(() => {
        // Subscribe
        const unsubscribe = NetInfo.addEventListener((state) => {
            // console.log("Connection type", state.type);
            // console.log("Is connected?", state.isConnected);
            setCheckNet(state.isConnected);
            dispatch({ type: 'NETWORK_UPDATE', isConnected: state.isConnected });
        });
        return function cleanup() {
            unsubscribe();
        };

    }, []);

    return (
        <>
            {
                (checkNet == false) ?
                    <View style={{ backgroundColor: "#de2626" }}>
                        <Text style={{textAlign: 'center', color: Colors.white}}>
                            You are offline
                        </Text>
                    </View>
                    :
                    <></>
            }

        </>
    )
}

const styles = StyleSheet.create({})

export default NetworkErr;