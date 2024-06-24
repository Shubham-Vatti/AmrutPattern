import PushNotification from 'react-native-push-notification'

class LocalNotificationService {
    configure = (onOpenNotification) => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log("Token", token);
            },
            onNotification: function (notification) {
                if (!notification.data || notification.channelId !== "NewsNotification") {
                    return;
                }
                notification.userInteraction = true;
                console.log("On local notification", notification);
                onOpenNotification(notification, true);
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        })
    }

    unRegister = () => {
        PushNotification.unregister();
    }

    showNotification = (id, title, message, image, data = {}, options = {}) => {
        console.log("local notification initilized");
        PushNotification.createChannel(
            {
              channelId: "NewsNotification", // (required)
              channelName: "Special messasge", // (required)
              channelDescription: "Notification for special message", // (optional) default: undefined.
              importance: 4, // (optional) default: 4. Int value of the Android notification importance
              vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
          );
        PushNotification.localNotification({
            ...this.buildAndroidNotification(id, title, message, data, options),
            title: title || "",
            message: message || "",
            picture: image || "",
            playSound: options.playSound || false,
            soundName: options.soundName || "default",
            userInteraction: false,
            channelId: "NewsNotification",
            badge: true
        });
    }

    buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
        return {
            id: id,
            autoCancel: true,
            largeIcon: options.largeIcon || "ic_launcher",
            smallIcon: options.smallIcon || "ic_launcher",
            bigText: message || "",
            subText: title || "",
            vibrate: options.vibrate || true,
            vibration: options.vibration || 300,
            priority: options.priority || 'high',
            importance: options.importance || 'high',
            data: data
        }
    }

    cancelAllLocalNotification = () => {
        PushNotification.cancelAllLocalNotifications();
    }

    removeDeliveredNotificationByID = (notificationid) => {
        PushNotification.cancelLocalNotification({ id: notificationid });
    }
}

export const localNotificationService = new LocalNotificationService();