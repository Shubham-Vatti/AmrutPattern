import AsyncStorageLib from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { localNotificationService } from './LocalNotificationService'

class FCMService {
    register = (onRegister, onNotification, onOpenNotification) => {
        this.checkPermission(onRegister);
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification);
    }

    registerAppWithFCM = async () => {
        if (Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled();
        }
    }

    checkPermission = (onRegister) => {
        messaging().hasPermission().then(enabled => {
            if (enabled) {
                this.getToken(onRegister);
            } else {
                this.requestPermission(onRegister);
            }
        }).catch(err => {
            console.log("Permission rejected", error);
        })
    }

    getToken = async (onRegister) => {
        let fcmtoken = await AsyncStorageLib.getItem("fcmToken");
        if (fcmtoken && typeof fcmtoken === "string") {
            onRegister(fcmtoken);
        } else {
            messaging().getToken().then(fcmToken => {
                if (fcmToken) {
                    onRegister(fcmToken, true);
                } else {
                    console.log("Not found user token");
                }
            }).catch((error) => {
                console.log("getToken rejected", error);
            })
        }
    }

    requestPermission = (onRegister) => {
        messaging().requestPermission().then(() => {
            this.getToken(onRegister)
        }).catch((error) => {
            console.log("Request permission rejected", error);
        })
    }

    deleteToken = () => {
        messaging().deleteToken().catch((error) => {
            console.log("delete token rejected", error);
        })
    }

    createNotificationListeners = (onRegister, onNotification, onOpenNotification) => {
        console.log("listener start");
        messaging().onNotificationOpenedApp(remoteMessage => {
            if (remoteMessage) {
                const notification = remoteMessage;
                onOpenNotification(notification);
            }
        })

        messaging().getInitialNotification().then((remoteMessage) => {
            console.log("getInitialNotification", remoteMessage);
            if (remoteMessage) {
                const notification = remoteMessage;
                localNotificationService.cancelAllLocalNotification();
                onOpenNotification(notification);
            }
        })

        this.messageListener = messaging().onMessage(async remoteMessage => {
            if (remoteMessage) {
                onNotification(remoteMessage);
            }
        })

        messaging().onTokenRefresh(fcmToken => {
            onRegister(fcmToken);
        })
    }

    unRegister = () => {
        this.messageListener();
    }

    stopAlarmRing = async () => {
        if (Platform.OS == "ios") {
            await messaging().stopAlarmRing();
        }
    }
}

export const fcmService = new FCMService();