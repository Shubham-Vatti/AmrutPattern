import React, { useContext, useState } from 'react';
import { View, ImageBackground, StyleSheet, Text, TextInput, Button, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import { CheckBox } from '@rneui/themed';
import { Colors } from '../constants/Theme';
import { useForm, Controller } from "react-hook-form";
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ToastAndroid } from 'react-native';
import Config from 'react-native-config';
import Plan from '../assets/logo.png'
import { AuthContext } from '../../App';

const LoginPage = ({ navigation }) => {

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            mobile: "",
            agree: true,
            whatsapp: true
        }
    });
    const [isSubmitted, setSubmitted] = useState(false);
    const { updateVerifyOption } = useContext(AuthContext);

    const onSubmit = (data) => {
        setSubmitted(true);
        // console.log("process.env.API_BASE_URL", Config.API_BASE_URL);
        axios
            .post(`${Config.API_BASE_URL}/login/send-otp`, { "mobile": data.mobile })
            .then(async (res) => {
                setSubmitted(false);
                if (res.data.status === "200") {
                    await AsyncStorageLib.setItem("mobilenumber", data.mobile);
                    if(res.data.auth_method==="otp"){
                        ToastAndroid.show("OTP send successfully", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        updateVerifyOption("otp");
                    }
                    navigation.navigate('OtpVerify')
                } else {
                    ToastAndroid.show(res.data?.message || "Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                }
            }).catch(() => {
                setSubmitted(false);
                ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
            });
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Image source={Plan} style={{ height: 150, width: 140, alignSelf: "center", resizeMode: 'contain' }} />
                    <Text style={styles.text}>Amrut Pattern</Text>
                    {/* <Text style={{ fontSize: 16, textAlign: "center", paddingVertical: 15 }}>We will send you an One Time Password on this mobile number </Text> */}
                    <View style={{ marginBottom: 10, marginTop: 20 }}>
                        <Text style={styles.label}>Enter mobile number</Text>
                        <Controller
                            control={control}
                            name="mobile"
                            rules={{
                                required: "Please enter mobile number",
                                pattern: {
                                    value: /^[6789]\d{9}$/,
                                    message: "Please enter a valid mobile number"
                                }
                            }}
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    value={value}
                                    // placeholder=''
                                    style={styles.inputfield}
                                    keyboardType='numeric'
                                    onChangeText={onChange}
                                    placeholder="Mobile number"
                                    editable={!isSubmitted}
                                />
                            )}
                        />
                        {
                            errors.mobile &&
                            <Text style={{ color: '#ff0000' }}>{errors.mobile.message}</Text>
                        }
                        <View style={{ marginBottom: 10 }}>
                            <View style={styles.checkboxContainer}>
                                <Controller
                                    control={control}
                                    name="agree"
                                    rules={{
                                        required: true,
                                    }}
                                    render={({ field }) => (
                                        <CheckBox
                                            checked={field.value}
                                            onIconPress={(newValue) => field.onChange(!field.value)}
                                        />
                                    )}
                                />
                                <Text style={styles.textfont}>I agree to the terms of service and privacy Policy of Amrut Pattern</Text>
                            </View>
                            {errors.agree && <Text style={{ color: 'red' }}>*Required</Text>}
                        </View>
                        <View style={{ width: "100%", marginTop: 20 }} pointerEvents={isSubmitted ? "none" : "auto"}>
                            <TouchableOpacity activeOpacity={0.9} style={styles.verify} onPress={handleSubmit(onSubmit)}>
                                {
                                    isSubmitted ?
                                        <ActivityIndicator color="#fff" /> :
                                        <Text style={styles.verifytext}>Next</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        // flexDirection: "column",
        backgroundColor: "#fff"
    },
    image: {
        flex: 1,
        width: '100%',
    },
    text: {
        color: '#000',
        textAlign: 'center',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        // elevation: 15,
        paddingVertical: 50,
        marginHorizontal: 10,
        // margin: 12,

        // flex: 1
    },
    inputfield: {
        borderWidth: 2,
        borderColor: Colors.secondary,
        fontSize: 16,
        padding: 12,
        borderRadius: 6,
        color: '#080808'
    },
    checkbox: {
        alignSelf: "center",
    },
    checkboxContainer: {
        flexDirection: "row",
        marginTop: 5
    },
    textfont: {
        // marginTop: 10,
        fontSize: 14,
        fontWeight: '500',
        width:'70%'
        // marginHorizontal: 10
    },
    label: {
        textAlign: "left",
        color: "#000",
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 5
    },
    verify: {
        backgroundColor: Colors.secondary,
        padding: 15,
        borderRadius: 6
    },
    verifytext: {
        textAlign: "center",
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
        textTransform: "uppercase"
    },
    // checkbox: {
    // 	alignSelf: "center",
    // },
    // checkboxContainer: {
    // 	flexDirection: "row",
    // },
    // textfont: {
    // 	marginBottom: 10,
    // 	fontSize: 16,
    // 	fontWeight: '500',
    // 	alignSelf: 'center'
    // },
})

export default LoginPage;