import React, {useContext, useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Dimensions, Alert, TouchableOpacity, StatusBar} from 'react-native';
import axios from 'axios';
import {AuthContext} from '../../App';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import Video from 'react-native-video';
import Ionicon from 'react-native-vector-icons/Ionicons';

function VideoView({route}) {
  const {video_id} = route.params;

  const {signOut, language, isNetworkAvailable,AppVersion} = useContext(AuthContext);
  const [videoData, setVideoData] = useState([]);
  const [loading, setloading] = useState(true);
  const [rotate, setRotate] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      let checkToken = await AsyncStorageLib.getItem('amrut_session');

      if (checkToken == null) {
        signOut();
        return;
      }

      const videoGetApiUrl = `${Config.API_BASE_URL}/videos/detail/${video_id}?language=${language}&version=${AppVersion}`;
      axios
        .get(videoGetApiUrl, {headers: {Authorization: checkToken}})
        .then(res => {
          if (res.data.success == true) {
            console.log('res.data.response', res.data.response);
            setVideoData(res.data.response);
            setloading(true);
          } else {
            ToastAndroid.show(
              'Something went wrong',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
          }
        });
    };
    getToken();
  }, [loading, isNetworkAvailable]);

  // console.log('videoData', videoData);
  return (
    <View style={styles.container}>
            <StatusBar hidden={true} />
            {
               (videoData.video && videoData.video != null) &&
               loading ?
               <>
               {
               (rotate===false)?
                   <Ionicon name='scan' size={25} color={'#fff'} style={styles.expand} onPress={()=>{setRotate(true)}} />
                   :
                   <Ionicon name='ios-resize-outline' size={25} color={'#fff'} style={styles.collaps} onPress={()=>{setRotate(false)}} />
               }
               <Video 
                 source={{uri: videoData.video}}
                 style={(rotate===false) ? styles.portraitMode : styles.LandscapeMode}
                 controls={true}
                 resizeMode={'contain'}
               />
               </>
               :
               <ActivityIndicator size={'large'} />

            }
        </View>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000'
    },
    portraitMode : {
        height: windowHeight,
        width: windowWidth,
        
    },
    LandscapeMode: {
      height: windowWidth,
      width: windowHeight,
      marginBottom: 10,
      transform: [{rotate: '90deg'}]
    },
    expand: {
        position: 'absolute',
        top: 10,
        right: 20,
        zIndex: 1,
        backgroundColor: '#000'
    },
    collaps: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        zIndex: 1,
        backgroundColor: '#000', 
        paddingLeft: 2,
        transform: [{rotate: '90deg'}]
    }
})

export default VideoView;
