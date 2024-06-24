import React, { useContext, useState, useEffect, useCallback } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, Button, ToastAndroid, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Theme';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../../App';
import Config from 'react-native-config';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import DropDown from '../components/DropDown';
import { Controller, useForm } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { CommonInput } from '../components/CommonInput';
import { translator } from '../locales/I18n';

export const ChatForm = ({ navigation }) => {
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        criteriaMode: "all", defaultValues: {
            crop: "",
            subject: "",
            message: ""
        }
    });
    const [state, setState] = useState({
        subject: '',
        message: '',
        crops_list: ''
    });

    // const handleChange = (value, name) => {
    // 	setState((preVal) => {
    // 		return {
    // 			...preVal,
    // 			[name]: value
    // 		}
    // 	})
    // }
    const [token, setToken] = useState();
    const [isSubscribed, setIsSubscribed] = useState(true);
    const [cropList, setCropList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { signOut, language, isNetworkAvailable } = useContext(AuthContext)
    useFocusEffect(
        useCallback(() => {
            const getToken = async () => {
                let checkToken = await AsyncStorageLib.getItem("amrut_session");
                setToken(checkToken);
                if (checkToken == null) {
                    signOut();
                    return;
                }
                const getApiUrl = `${Config.API_BASE_URL}/customer-crops-list`;
                axios.get(getApiUrl, { headers: { 'Authorization': checkToken } })
                    .then((res) => {
                        if (res.data.success == true) {
                            setCropList(res.data.response);
                            if (res.data.response.length == 0 || res.data.response[0].customer_subscription_id === null) {
                                setIsSubscribed(false);
                            }

                            // console.log("res.data.response", res.data.response)
                        } else {
                            setCropList([]);
                            setIsSubscribed(false);
                            // ToastAndroid.show("Somthing went Wrong 12", ToastAndroid.LONG, ToastAndroid.CENTER);
                        }
                        // setCropsListApi(true);
                        setLoading(true);
                        // console.log(res.data);
                    }).catch(function (error) {
                        // handle error
                        // alert(error.message);
                    })
            }
            getToken();

        }, [isNetworkAvailable])
    )
    console.log("isSubscribed", isSubscribed)
    // {
    // 	isSubscribed.map((state)=>(
    // 		console.log(state.title)
    // 	))
    // }

    const onSubmit = (data) => {
        // alert('Subject: ' + state.subject + ' & Message: ' + state.message + '& Chat_list' + state.crop);
        // return;

        const postChatFormApiUrl = `${Config.API_BASE_URL}/customer-chat`;
        axios.post(postChatFormApiUrl, { "title": data.subject, "description": data.message, "crop_id": data.crop }, { headers: { 'Authorization': token } })
            .then(async (res) => {
                // console.log(" new chat is ", res.data);
                if (res.data.success == true) {
                    ToastAndroid.show("Chat created successfully", ToastAndroid.LONG, ToastAndroid.TOP, 25, 500);
                    navigation.navigate('Chats')
                    // console.log("my response is -",res.data.response);
                } else {
                    ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
                }
                // console.log(res.data);
            }).catch(function (error) {
                // console.log(error);
                // handle error
                // alert(error.message);

            })

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodybackground }}>
            {
                (isSubscribed == true) ?
                    <>
                        {
                            loading ?
                                <>
                                    <View style={styles.container}>
                                        <Text style={styles.textInput}>{translator("chat.crops", language)}</Text>
                                    </View>
                                    <View>
                                        <View style={{ ...styles.container, ...styles.input }}>
                                            {/* <DropDown name="crop_list"  control={control} dropdown={{...isSubscribed.id, ...isSubscribed.title}} /> */}
                                            <Controller
                                                control={control}
                                                name="crop"
                                                rules={{
                                                    required: "Crop list is required",
                                                    minLength: {
                                                        value: 2,
                                                    },
                                                }}
                                                render={({ field: { value, onChange } }) => (
                                                    <Picker
                                                        style={styles.picker}
                                                        selectedValue={value}
                                                        onValueChange={(val) => { onChange(val); }}
                                                    >

                                                        <Picker.Item label={translator("chat.select_crop", language)} value="" />
                                                        {/* <Picker.Item label={isSubscribed.title} value={isSubscribed.crop_id} /> */}
                                                        {
                                                            cropList.map((state, index) => (
                                                                state.subscribed == 1 &&
                                                                <Picker.Item label={state.title} value={state.crop_id} key={index} />
                                                            ))
                                                        }
                                                    </Picker>
                                                )}
                                            // error={errors.chat_list && <Text style={{ color: 'red' }}>Name is required.</Text>}
                                            />
                                        </View>
                                        {
                                            errors.crop && <Text style={{ color: "red", paddingStart: 18 }}>{errors.crop.message}</Text>
                                        }
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={styles.textInput}>{translator("chat.subject", language)}</Text>
                                        <CommonInput
                                            control={control}
                                            // setValue={'firstName', customerdetails.firstName}
                                            name="subject"
                                            editable={true}
                                            rules={{
                                                minLength: {
                                                    value: 2,
                                                    message: "Enter Atleast 2 Charecter"
                                                },
                                                required: "Name is required",
                                            }}
                                            placeholder={translator("chat.sub_placeholder", language)}
                                            error={errors.subject ? errors.subject.message : null}
                                        // error={errors.firstName && <Text style={{ color: 'red' }}>Name is required.</Text>}
                                        />
                                    </View>
                                    <View style={styles.container}>
                                        <Text style={styles.textInput}>{translator("chat.message", language)}</Text>
                                        <CommonInput
                                            control={control}
                                            // setValue={'firstName', customerdetails.firstName}
                                            name="message"
                                            editable={true}
                                            rules={{
                                                minLength: {
                                                    value: 2,
                                                    message: "Enter Atleast 2 Charecter"
                                                },
                                                required: "Message is required",
                                            }}
                                            placeholder={translator("chat.message_place", language)}
                                            error={errors.message ? errors.message.message : null}
                                        // error={errors.firstName && <Text style={{ color: 'red' }}>Name is required.</Text>}
                                        />
                                    </View>
                                    <View style={styles.container}>
                                        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleSubmit(onSubmit)}>
                                            <Text style={styles.buttontext}>{translator("chat.button", language)}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                                :
                                <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 20, flex: 1 }}>
                                    {/* <Text style={{ fontSize: 18, padding: 5, marginHorizontal: 15 }}></Text> */}
                                    <ActivityIndicator size="large" />

                                </View>

                        }
                    </>
                    :
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, alignSelf: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 18, textAlign: 'center' }} >{translator("chat.no_sub_crop", language)}</Text>
                    </View>

            }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        // margin: 10,
        marginHorizontal: 20,
        marginTop: 10,
    },
    text: {
        fontSize: 40,
        margin: 10,
        textAlign: 'center',
    },
    input: {
        marginBottom: 5,
        // height: 60,
        borderWidth: 1,
        // padding: 10,
        fontSize: 20,
        borderRadius: 5,
        borderColor: Colors.secondary,
    },
    textInput: {
        fontSize: 20,
        // height: 30,
        // padding: 1,
    },
    button: {
        backgroundColor: Colors.secondary,
        padding: 10,
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 8
    },
    buttontext: {
        color: 'white',
        fontSize: 24,
        textAlign: 'center',
    },
});

export default ChatForm;