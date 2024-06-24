import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ToastAndroid, Keyboard, Modal, ActivityIndicator, PermissionsAndroid, Platform, Alert, ImageBackground, } from "react-native";
import RNFetchBlob from 'rn-fetch-blob';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from "../../App";
import axios from "axios";
import Config from "react-native-config";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
// import Swiper from "react-native-swiper";
import { Colors } from "../constants/Theme";
// import VideoPlayer from "react-native-video-player";
import * as RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";
import parseErrorStack from "react-native/Libraries/Core/Devtools/parseErrorStack";

export function ChatView({ route, navigation }) {
    const { chat_id, image } = route.params;
    console.log("chat_id", chat_id)
    console.log("chat_image", image)
    const [inputValue, setInput] = useState("");
    const [chats, setChats] = useState([]);
    const [token, setToken] = useState("");
    const [startIterval, setStartInterval] = useState(false);
    const [chatLoad, setChatLoad] = useState([])
    const { signOut, isNetworkAvailable } = useContext(AuthContext)
    const scrollViewRef = useRef();
    const [modalimg, setmodalimg] = useState({});
    const [downloading, setDownLoading] = useState(false)
    // const [IsOpened, setIsOpened] = useState(true)
    useFocusEffect(
        useCallback(() => {
            let interval = setInterval(() => {
                if (token == null) {
                    signOut();
                    return;
                }
                // console.log("call")
                const postCustomerChatListApiUrl = `${Config.API_BASE_URL}/customer-chat/unread`;
                axios
                    .post(postCustomerChatListApiUrl, { "chat_id": chat_id }, { headers: { 'Authorization': token } })
                    .then((res) => {
                        if (res.data.success == true && res.data.response.messages.length > 0) {
                            console.log(res.data.response);
                            setChats([
                                ...res.data.response.messages,
                                ...chats,
                            ])
                        }
                    })
                    .catch((err) => {
                        // alert("error");
                    })
                setStartInterval(true);
            }, 3000);
            return () => {
                clearInterval(interval);
            }
        }, [chats, isNetworkAvailable])
    )

    useFocusEffect(
        useCallback(() => {
            const getToken = async () => {
                let checkToken = await AsyncStorageLib.getItem("amrut_session");
                setToken(checkToken);

                if (checkToken == null) {
                    signOut();
                    return;
                }

                // navigation.setOptions({ title: route.params.title});
                const postCustomerAllChatListApiUrl = `${Config.API_BASE_URL}/customer-chat/all`;
                axios
                    .post(postCustomerAllChatListApiUrl, { "chat_id": chat_id }, { headers: { 'Authorization': checkToken } })
                    .then((res) => {
                        console.log("res - ", res.data);
                        if (res.data.success == true) {
                            // console.log("hello word")
                            // console.log(res.data.response.messages)
                            setChats(res.data.response.messages);
                            setStartInterval(true);
                            // setTimeout(() => {

                            // }, 300);
                        }

                    })
                    .catch((er) => {
                        // alert("error")
                    })
            }
            getToken();
        }, [isNetworkAvailable])
    )
    // console.log(chatLoad);



    const send = async () => {
        if (inputValue.trim() !== "") {
            // useEffect(() => {
            // const getToken = async () => {
            let checkToken = await AsyncStorageLib.getItem("amrut_session");
            setToken(checkToken);

            if (token == null) {
                signOut();
                return;
            }
            const postCustomerChatApiUrl = `${Config.API_BASE_URL}/cust-chat-message`;
            axios
                .post(postCustomerChatApiUrl, { "chat_id": chat_id, "message": inputValue }, { headers: { 'Authorization': token } })
                .then((res) => {
                    console.log("no_sub_crop", res);
                    if (res.data.success == true) {
                        // setChatLoad([...res.data.response]);
                        let date = new Date();
                        // chats.push({ customer_id: 2, message: inputValue, created_at: date, id: Math.random() })
                        setChats([{ customer_id: 2, message: inputValue, created_at: date, id: Math.random() }, ...chats]);
                        setInput("");

                    } else if (res.data.response) {
                        // console.log("no_sub_crop", res.data)
                        Keyboard.dismiss();
                        setInput("");
                        ToastAndroid.show(res.data.response, ToastAndroid.BOTTOM, ToastAndroid.LONG);
                    }
                })
                .catch((err) => {
                    Keyboard.dismiss();
                    ToastAndroid.show("Something went wrong", ToastAndroid.BOTTOM, ToastAndroid.SHORT);
                })
            // }
            // getToken();
            // }, [])
        }
    }

    const pickimage = () => {
        launchImageLibrary({ mediaType: "mixed" }).then((res) => {
            console.log("picker image data", res);

            if (res.didCancel == true) {
                console.warn("No image select");
            } else if (res.assets && res.assets.length > 0) {
                setmodalimg(res.assets[0]);
            }
        })
    }
    const sendDoc = async () => {
        // alert("hello");
        // return;
        let checkToken = await AsyncStorageLib.getItem("amrut_session");
        setToken(checkToken);

        if (token == null) {
            signOut();
            return;
        }
        const fileUploadUrl = `${Config.API_BASE_URL}/cust-chat-message-file`;
        const formData = new FormData();
        formData.append("chat_id", chat_id);
        formData.append("file", {
            uri: modalimg.uri,
            type: modalimg.type,
            name: modalimg.fileName
        });
        try {
            let response = await fetch(fileUploadUrl, {
                method: "POST",
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": token
                }
            })
                .then((res) => {

                    return res.json();
                }).then((json) => {
                    console.log("chech", json)
                    return json
                })
            if (response && response.status && response.status === 200) {
                checkPermission(response.response.file_url, true);
                console.log("response", response.response);
                let date = new Date();
                setChats([{ customer_id: 2, message: "", image: response.response.file_url, file_deleted: response.response.file_deleted, file_type: response.response.file_type, created_at: date, id: Math.random() }, ...chats]);
                ToastAndroid.show("file shared successfully", ToastAndroid.BOTTOM, ToastAndroid.SHORT);
                setmodalimg({});
            } else {
                // console.log("response1", response.response);
                ToastAndroid.show(response.response, ToastAndroid.BOTTOM, ToastAndroid.LONG);
                setmodalimg(false)
            }
        } catch (error) {
            console.log("error", error);
            ToastAndroid.show("Something went wrong", ToastAndroid.BOTTOM, ToastAndroid.LONG);
        }

    }
    const checkPermission = async (FILE_URL, souldOpen = false) => {
        if (downloading === false) {
            setDownLoading(true)

            // console.log("FILE_URL", FILE_URL)

            // Function to check the platform
            // If Platform is Android then check for permissions.

            if (Platform.OS === 'ios') {
                downloadFile(FILE_URL);
            } else {
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
                    .then((isPermitted) => {
                        if (isPermitted) {
                            // Start downloading
                            downloadFile(FILE_URL, souldOpen);
                        } else {
                            PermissionsAndroid.requestMultiple([
                                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                            ]).then((isGranted) => {
                                if (
                                    isGranted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                                    isGranted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
                                ) {
                                    // Start downloading
                                    downloadFile(FILE_URL, souldOpen);
                                } else {
                                    Alert.alert('Error', 'Storage Permission Not Granted');
                                }
                            })
                        }
                    })
            }
        }
    };

    const downloadFile = (FILE_URL, IsOpen = false) => {
        // console.log("RNFS.ExternalStorageDirectoryPath", RNFS.ExternalStorageDirectoryPath)
        // return;
        console.log("IsOpened", IsOpen);
        // return;
        let file_name = getFileUrl(FILE_URL);
        console.log("file_name", file_name);
        const { config, fs } = RNFetchBlob;

        RNFetchBlob.fs.exists(RNFS.ExternalStorageDirectoryPath + '/Download/Amrut Pattern/' + file_name)

            .then((exist) => {
                // console.log(`file ${exist ? '' : 'not'} exists`)
                console.log("exist", exist)
                if (exist == true) {
                    setDownLoading(false)
                    FileViewer.open(RNFS.ExternalStorageDirectoryPath + '/Download/Amrut Pattern/' + file_name)
                    // alert("file is already downloaded")
                } else {
                    setDownLoading(true)
                    let options = {
                        fileCache: false,
                        addAndroidDownloads: {
                            path:
                                RNFS.ExternalStorageDirectoryPath +
                                '/Download/Amrut Pattern/' + file_name,
                            description: 'downloading file...',
                            notification: IsOpen ? false : true,
                            // useDownloadManager works with Android only
                            useDownloadManager: true,
                        },
                    };
                    console.log('Download starting', FILE_URL);
                    config(options)
                        .fetch('GET', FILE_URL)
                        .then(res => {
                            if (IsOpen) {
                                ToastAndroid.show("file saved successfully", ToastAndroid.BOTTOM, ToastAndroid.SHORT);
                            } else {
                                FileViewer.open(RNFS.ExternalStorageDirectoryPath + '/Download/Amrut Pattern/' + file_name)
                                // Alert after successful downloading
                                console.log('res -> ', JSON.stringify(res));
                                alert('File Downloaded Successfully.');
                            }
                            setDownLoading(false)
                        }).catch((err) => {
                            console.log("error: ", parseErrorStack)
                        });
                }

            })
            .catch((err) => {
                setDownLoading(false)
                alert(err)
            })
        return;

    };

    const getFileUrl = fileUrl => {
        // To get the file extension
        let file_name = fileUrl.split('/');
        file_name = file_name[file_name.length - 1];
        return file_name;
    };

    const clickIamge = () => {
        let options = {
            maxWidth: 200,
            maxHeight: 200,
            selectionLimit: 1,
            mediaType: "photo",
            includeBase64: true
        }

        launchCamera(options).then((res) => {
            if (res.didCancel == true) {
                console.warn("No image select");
            } else if (res.assets && res.assets.length > 0) {
                setmodalimg(res.assets[0]);
            }
        })
    }



    return (
        <>
            {
                downloading &&
                <View style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0, justifyContent: "center", alignItems: "center", zIndex: 999 }}>
                    <View style={{ width: 100, height: 100, backgroundColor: "#fff", justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color={Colors.secondary} />
                        <Text>Processing...</Text>
                    </View>
                </View>
            }
            <View style={styles.container}>
                <FlatList
                    data={chats}
                    renderItem={({ item, index }) => <MessageInbox item={item} index={index} downloading={downloading} setDownLoading={setDownLoading} checkPermission={checkPermission} length={chats.length} />}
                    ref={scrollViewRef}
                    inverted={true}
                />
                <View style={styles.inputBox}>
                    <TextInput
                        defaultValue={inputValue}
                        style={styles.input}
                        placeholder="Type here..."
                        onChangeText={(e) => {
                            setInput(e);
                        }}
                    />
                    {
                        inputValue.trim() === "" &&
                        <>
                            <TouchableOpacity activeOpacity={0.8} onPress={clickIamge}
                                style={{ paddingVertical: 10, position: "absolute", left: "75%", top: 10 }}
                            >
                                <Ionicon name='camera-outline' size={30} color="#029688" />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.8} onPress={pickimage}
                                style={{ paddingVertical: 10, position: "absolute", left: "84%", top: 10 }}
                            >
                                <Ionicon name='attach-outline' size={30} color="#029688" />
                            </TouchableOpacity>
                        </>
                    }
                    <TouchableOpacity activeOpacity={0.8} onPress={send}>
                        <Ionicon name='send' size={25} color="#029688"
                            style={{
                                paddingVertical: 12,
                                paddingStart: 12,
                                opacity: inputValue.trim() !== "" ? 1 : 0.5
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                transparent={true}
                visible={(Object.keys(modalimg).length > 0) ? true : false}
                animationType="fade"
            >
                <View style={{ backgroundColor: '#fff', flex: 1, justifyContent: "center" }}>
                    {
                        modalimg.duration ?<></>
                            // <VideoPlayer
                            //     // resizeMode='cover'
                            //     autoplay={false}
                            //     defaultMuted={true}
                            //     video={{ uri: modalimg.uri }}
                            //     videoWidth={1600}
                            //     videoHeight={900}
                            //     thumbnail={{ uri: modalimg.uri }}
                            // />
                            :
                            <Image source={{ uri: modalimg.uri }} style={{ height: 250, width: '100%', resizeMode: "stretch" }} />
                    }
                    <TouchableOpacity style={styles.closeBtn} activeOpacity={1} onPress={() => setmodalimg({})}>
                        <Ionicon name="close-outline" color={"#000"} size={40} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sendBtn} activeOpacity={1} onPress={sendDoc}>
                        <Ionicon name="md-cloud-upload-outline" color={"#fff"} size={40} /><Text style={{ fontSize: 18, color: Colors.white, paddingBottom: 5 }}>upload</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    )
}


const MessageInbox = ({ item, index, downloading, setDownLoading, checkPermission, length }) => {

    let date = new Date();
    const Slice = (value) => {
        return ('0' + value).slice(-2)
    }

    const chatDate = (date) => {
        let newDate = new Date(date);
        let hour = newDate.getHours() > 12 ? newDate.getHours() % 12 : newDate.getHours();
        return `${Slice(hour)}:${Slice(newDate.getMinutes())} ${newDate.getHours() >= 12 ? 'PM' : 'AM'}`;
    }

    return (
        <>
            {
                parseInt(item.customer_id) > 0 ?
                    <>
                        {
                            item.image == null ?
                                <View style={{ ...styles.card, ...styles.messageCard,  marginTop: index === length - 1 ? 12 : 0 }} key={item.id}>
                                    <Text style={styles.textWhite}>{item.message}</Text>
                                    <Text style={[styles.time, styles.textWhite]}>{chatDate(item.created_at)}</Text>
                                </View>
                                :
                                <>
                                    {
                                        item.file_deleted == 0 ?
                                            <>
                                                {
                                                    (item.file_type === "Image") ?
                                                        <View style={{ ...styles.card, ...styles.messageCard, marginLeft: 'auto',  marginTop: index === length - 1 ? 12 : 0 }} key={item.id}  >
                                                            <TouchableOpacity onPress={() => { checkPermission(item.image) }} >
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 2 }}>
                                                                    <Ionicon name="image" size={30} color={Colors.white} />
                                                                    <Text style={styles.textWhite}> IMAGE</Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                            <Text style={[styles.time, styles.textWhite]}>{chatDate(item.created_at)}</Text>
                                                        </View>
                                                        :
                                                        (item.file_type === "Video") ?

                                                            <View style={{ ...styles.card, ...styles.messageCard, marginLeft: 'auto',  marginTop: index === length - 1 ? 12 : 0 }} key={item.id} onPress={checkPermission} >
                                                                <TouchableOpacity onPress={() => { checkPermission(item.image) }} >
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 2 }}>
                                                                        <Ionicon name="play-circle-outline" size={30} color={Colors.white} />
                                                                        <Text style={styles.textWhite}> VIDEO</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                                <Text style={[styles.time, styles.textWhite]}>{chatDate(item.created_at)}</Text>
                                                            </View>
                                                            :
                                                            (item.file_type === "Document") ?
                                                                <View style={{ ...styles.card, ...styles.messageCard, flexDirection: 'row', marginLeft: 'auto', marginTop: index === length - 1 ? 12 : 0 }} key={item.id} onPress={checkPermission} >
                                                                    <TouchableOpacity onPress={() => { checkPermission(item.image) }} >
                                                                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 2 }}>
                                                                            <Ionicon name="document" size={25} color={Colors.white} style={{ padding: 0 }} />
                                                                            <Text style={styles.textWhite}> Document</Text>
                                                                        </View>
                                                                    </TouchableOpacity>
                                                                    <Text style={[styles.time, styles.textWhite]}>{chatDate(item.created_at)}</Text>
                                                                </View>
                                                                : <></>
                                                }

                                            </>
                                            :
                                            <View style={{ ...styles.card, backgroundColor: 'rgba(0,0,0,0.2)', marginLeft: 'auto',  marginTop: index === length - 1 ? 12 : 0 }} key={item.id}>
                                                <Text style={styles.textWhite}>This file was deleted</Text>
                                                <Text style={[styles.time, styles.textWhite]}>{chatDate(item.created_at)}</Text>
                                            </View>
                                    }
                                </>

                        }

                    </>
                    :
                    <>
                        {
                            (item.image == null) ?
                                <View style={{ ...styles.usercard, ...styles.card, marginTop: index === 0 ? 0 : 0 }} key={item.id}>
                                    <Text>{item.message}</Text>
                                    <Text style={styles.time}>{chatDate(item.created_at)}</Text>
                                </View>
                                :
                                <>
                                    {
                                        (item.file_deleted == 0) ?
                                            <>
                                                {
                                                    (item.file_type === "Image") ?

                                                        <View style={{ ...styles.usercard, ...styles.card, marginTop: index === 0 ? 12 : 0 }} key={item.id}>
                                                            <TouchableOpacity onPress={() => { checkPermission(item.image) }} >
                                                                {/* <Image source={{ uri: item.image }} style={{ height: 150, width: 150 }} /> */}
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 2 }}>
                                                                    <Ionicon name="image" size={30} color={Colors.black} />
                                                                    <Text style={{ color: Colors.black }}> IMAGE</Text>
                                                                </View>
                                                                {/* <Image source={{ uri: 'file:///storage/emulated/0/Amrut Pattern/Chats/' + getFileUrl(item.image) }} style={{ height: 150, width: 150 }} /> */}
                                                            </TouchableOpacity>
                                                            <Text style={styles.time}>{chatDate(item.created_at)}</Text>
                                                        </View>
                                                        :
                                                        (item.file_type === "Video") ?

                                                            <View style={{ ...styles.usercard, ...styles.card, marginTop: index === 0 ? 12 : 0 }} key={item.id}>
                                                                <TouchableOpacity onPress={() => { checkPermission(item.image) }} style={{ flexDirection: 'row', }} >
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 2 }}>
                                                                        <Ionicon name="play-circle-outline" size={30} color={Colors.black} />
                                                                        <Text style={{ color: Colors.black }}> VIDEO</Text>
                                                                    </View>
                                                                    {/* <Image source={require('../assets/Video-thumbnail-1.png')} style={{ height: 150, width: 180 }} /> */}
                                                                </TouchableOpacity>
                                                                <Text style={styles.time}>{chatDate(item.created_at)}</Text>
                                                            </View>
                                                            :
                                                            (item.file_type === "Document") ?
                                                                <View style={{ ...styles.usercard, ...styles.card, marginTop: index === 0 ? 12 : 0 }} key={item.id}>
                                                                    <TouchableOpacity onPress={() => { checkPermission(item.image) }} style={{ flexDirection: 'row', }} >
                                                                        <Ionicon name="document" size={25} color={Colors.black} style={{ padding: 0 }} />
                                                                        <Text style={{ color: Colors.black, marginTop: 5 }}> Document </Text>
                                                                    </TouchableOpacity>
                                                                    <Text style={styles.time}>{chatDate(item.created_at)}</Text>
                                                                </View>
                                                                :
                                                                (item.file_type == null) ?
                                                                    <></>
                                                                    :
                                                                    <></>
                                                }

                                            </>
                                            :
                                            <View style={{ ...styles.card, backgroundColor: 'rgba(0,0,0,0.2)', marginRight: 'auto', marginTop: (index === 0) ? 12 : 0 }} key={item.id}>
                                                <Text style={{ color: Colors.black }}>This file was deleted</Text>
                                                <Text style={styles.time}>{chatDate(item.created_at)}</Text>
                                            </View>
                                    }

                                </>
                        }
                    </>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative"
    },
    scroller: {
        paddingHorizontal: 15
    },
    card: {
        paddingHorizontal: 10,
        fontSize: 16,
        maxWidth: "80%",
        paddingBottom: 22,
        position: "relative",
        marginBottom: 8,
        borderRadius: 5,
        minWidth: 80,
        paddingTop: 5,
        marginHorizontal: 15
    },
    usercard: {
        backgroundColor: "#fff",
        marginRight: "auto"
    },
    time: {
        position: "absolute",
        right: 10,
        bottom: 3,
        fontSize: 13
    },
    messageCard: {
        backgroundColor: "#029688",
        marginLeft: "auto"
    },
    inputBox: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    input: {
        borderWidth: 1,
        flex: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        // paddingRight: 50
    },
    textWhite: {
        color: "#fff"
    },
    closeBtn: {
        position: "absolute",
        top: 10,
        left: 10
    },
    sendBtn: {
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        padding: 2
    }
})