import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Button, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { Text, View } from 'react-native';
import { Colors } from '../constants/Theme'
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Config from 'react-native-config';
import Message from '../assets/logo.png';

import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { AuthContext } from '../../App';
import axios from 'axios';
import { ToastAndroid } from 'react-native';
import { TextInput } from 'react-native';
import { useTogglePasswordVisibility } from './Hooks/useTogglePasswordVisibility';
import { Pressable } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

const CELL_COUNT = 4;

function OtpVerificationScreen({ navigation }) {
    const { signIn, authVerificationMethod, updateVerifyOption } = useContext(AuthContext);
    const [mobile, setMobile] = useState(null);
    const [timer, setTimer] = useState(0);
    const [isSubmitted, setSubmit] = useState(false);
    const [value, setValue] = useState('');
    const [password, setPassword] = useState("");
    const otpRef = useRef(null);
    const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility();

    useFocusEffect(
        useCallback(() => {
            if (authVerificationMethod === "otp") {
                setTimer(60);
                otpRef.current.value = "";
            }
            const getMobile = async () => {
                let checknumber = await AsyncStorageLib.getItem("mobilenumber");
                setMobile(checknumber);
            }
            getMobile();
        }, [])
    )
    const [error, setError] = useState({
        otp: null,
        password: null
    });

    const isFormvalidated = () => {
        let isValid = true;
        const _error = { otp: null, password: null };
        if (value.length < 4 && authVerificationMethod === "otp") {
            isValid = false;
            _error.otp = "Please enter valid otp";
        }
        if (password === "") {
            isValid = false;
            _error.password = "Please enter password";
        } else if (password.length < 8) {
            isValid = false;
            _error.password = "Password must be 8 digit longer";
        }
        setError(_error);
        return isValid;
    }

    const onSubmit = () => {
        if (!isFormvalidated()) {
            return;
        }
        setSubmit(false);
        axios
            .post(`${Config.API_BASE_URL}/login/verify-otp`, { "mobile": mobile, "otp": value, password: password })
            .then(async (res) => {
                setSubmit(false);
                if (res.data.status === "200") {
                    ToastAndroid.show("Login successful", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                    AsyncStorageLib.setItem("amrut_session", res.data.authorization);
                    signIn(res.data);
                    updateVerifyOption("");
                } else {
                    ToastAndroid.show(res.data?.message || "Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                }
            }).catch((err) => {
                setSubmit(false);
                ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
            });
    }
    const resendOTP = () => {
        setSubmit(true);
        let apiUrl = `${Config.API_BASE_URL}/login/send-otp`;
        axios
            .post(apiUrl, { mobile: mobile })
            .then((res) => {
                setSubmit(false);
                if (res.data.status === "200") {
                    setTimer(60);
                    ToastAndroid.show("OTP send successfully", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                } else {
                    ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                }
            })
            .catch((e) => {
                setSubmit(false);
                ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM)
            })
    }

    useEffect(() => {
        let interval = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            }
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, [timer]);
    // const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const forgotPassword = () => {
        setSubmit(true);
        axios
            .post(`${Config.API_BASE_URL}/login/send-otp`, { "mobile": mobile, "reset_password": "1" })
            .then(async (res) => {
                setSubmit(false);
                if (res.data.status === "200") {
                    if (res.data.auth_method === "otp") {
                        ToastAndroid.show("OTP send successfully", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
                        updateVerifyOption("otp");
                        setTimer(60);
                    }
                } else {
                    ToastAndroid.show(res.data?.message || "Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
                }
            }).catch(() => {
                setSubmit(false);
                ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.BOTTOM);
            });
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}>
            <View style={styles.card}>
                <Image source={Message} style={{ width: 140, height: 150, resizeMode: 'contain', marginBottom: 20 }} />
                {
                    authVerificationMethod === "otp" &&
                    <>
                        <Text style={styles.title}>OTP Verification</Text>
                        <Text style={{ fontSize: 16, marginBottom: 8 }}>Enter the OTP sent to</Text>
                        <Text style={{ fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 30 }}>+91-{mobile}</Text>
                        <View style={{ marginBottom: 15, width: "100%" }}>
                            <Text style={styles.label}>OTP</Text>
                            <CodeField
                                ref={otpRef}
                                value={value}
                                onChangeText={(newVal) => {
                                    setValue(newVal);
                                    setError((prev) => {
                                        return {
                                            ...prev,
                                            otp: null
                                        }
                                    });
                                }}
                                // cellCount={CELL_COUNT}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                renderCell={({ index, symbol, isFocused }) => (
                                    <Text
                                        key={index}
                                        style={[styles.cell, index == 0 ? { marginLeft: 0 } : { marginLeft: 10 }, isFocused && styles.focusCell, error.otp !== null ? styles.cell1 : styles.cell]}
                                        onLayout={getCellOnLayoutHandler(index)}>
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                )}
                            />
                            {error.otp !== null && <Text style={{ color: 'red', alignSelf: "flex-start" }}>{error.otp}</Text>}
                        </View>
                    </>
                }
                <View style={{ marginBottom: 0, width: "100%" }}>
                    <Text style={{ ...styles.label, marginBottom: 8 }}>{authVerificationMethod === "otp" ? "New password" : "Password"}</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={password}
                            secureTextEntry={passwordVisibility}
                            style={{ ...styles.inputfield, paddingRight: 45 }}
                            onChangeText={setPassword}
                            placeholder={authVerificationMethod === "otp" ? "New password" : "Enter your password"}
                            editable={!isSubmitted}
                        />
                        <Pressable onPress={handlePasswordVisibility} style={styles.eyeIcon}>
                            <Ionicon name={rightIcon} size={22} color="#232323" />
                        </Pressable>
                    </View>
                    {error.password !== null && <Text style={{ color: 'red', alignSelf: "flex-start" }}>{error.password}</Text>}
                </View>
                {
                    authVerificationMethod !== "otp" &&
                    <TouchableOpacity activeOpacity={0.8} style={styles.forgotPassword} onPress={forgotPassword}>
                        <Text style={{ color: Colors.green }}>Forgot password ?</Text>
                    </TouchableOpacity>
                }
                <View style={{ width: "100%", marginTop: 20 }}>
                    <TouchableOpacity activeOpacity={0.9} style={styles.verify} onPress={onSubmit}>
                        {
                            isSubmitted ?
                                <ActivityIndicator color="#fff" /> :
                                <Text style={styles.text}>Login</Text>
                        }
                    </TouchableOpacity>
                </View>
                {
                    (timer > 0 && authVerificationMethod === "otp") ?
                        <Text style={{ fontSize: 16, marginTop: 15 }}>Resend OTP in <Text style={{ color: "#000", fontWeight: "600" }}>{('0' + timer).slice(-2)} seconds</Text></Text>
                        : (authVerificationMethod === "otp") &&
                        <Text style={{ fontSize: 16, marginTop: 15 }}>Didn't receive the OTP? <Text onPress={resendOTP} style={{ color: "red" }}>RESEND OTP</Text></Text>
                }
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, padding: 10, paddingLeft: 50, paddingRight: 50, backgroundColor: '#fff' },
    // title: { textAlign: 'center', fontSize: 20 },
    codeFieldRoot: { marginTop: 20, marginBottom: 10 },
    cell: {
        width: 75,
        height: 60,
        borderRadius: 10,
        lineHeight: 60,
        fontSize: 22,
        borderWidth: 2,
        borderColor: '#00000030',
        textAlign: 'center',
        marginBottom: 0
    },
    cell1: {
        borderColor: 'red',
    },
    focusCell: {
        borderColor: '#000',
    },
    verify: {
        backgroundColor: Colors.secondary,
        padding: 12,
        borderRadius: 6
    },
    text: {
        textAlign: "center",
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
        textTransform: "uppercase"
    },
    title: {
        fontSize: 22,
        color: "#000",
        fontWeight: "600",
        marginBottom: 15
    },
    card: {
        backgroundColor: "#fff",
        // elevation: 10,
        paddingHorizontal: 10,
        alignItems: "center",
        paddingVertical: 50,
        marginHorizontal: 13
    },
    verifynone: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: 12,
        borderRadius: 6
    },
    inputfield: {
        borderWidth: 2,
        borderColor: Colors.secondary,
        fontSize: 16,
        padding: 12,
        borderRadius: 6,
        color: '#080808',
        width: "100%"
    },
    label: {
        alignSelf: "flex-start",
        color: "#000",
        fontSize: 16,
        // fontWeight: "600"
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        position: "relative"
    },
    eyeIcon: {
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        padding: 15,
        paddingLeft: 0
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginTop: 5
    }
});

export default OtpVerificationScreen;