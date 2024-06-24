import React, {useContext, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import {AuthContext} from '../../App';
import axios from 'axios';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import {FacebookLoader} from 'react-native-easy-content-loader';
import {translator} from '../locales/I18n';
import Ionicon from 'react-native-vector-icons/Ionicons';

function HomeScreenVideo({navigation}) {
  const {signOut, language, isNetworkAvailable,AppVersion} = useContext(AuthContext);
  const [homeVideoData, setHomeVideoData] = useState([]);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      let checkToken = await AsyncStorageLib.getItem('amrut_session');

      if (checkToken == null) {
        signOut();
        return;
      }

      const videoGetApiUrl = `${Config.API_BASE_URL}/videos?language=${language}&version=${AppVersion}`;
      axios
        .get(videoGetApiUrl, {headers: {Authorization: checkToken}})
        .then(res => {
          if (res.data.success == true) {
            setHomeVideoData(res.data.response);
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
  }, [language, isNetworkAvailable]);

  // console.log("homeVideoData",homeVideoData)

  return (
    <View>
      {homeVideoData.length > 0 && (
        <View>
          {loading ? (
            <>
              <Text
                style={{
                  fontSize: 18,
                  paddingLeft: 20,
                  color: '#000',
                  fontWeight: '600',
                  marginTop: 10,
                }}>
                {translator('home.videos', language)}
              </Text>
              <FlatList
                data={homeVideoData}
                renderItem={({item, index}) => (
                  <VideoComponent
                    item={item}
                    index={index}
                    navigation={navigation}
                  />
                )}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 15}}
              />
            </>
          ) : (
            <FacebookLoader active />
          )}
        </View>
      )}
    </View>
  );
}

export default HomeScreenVideo;

const VideoComponent = ({item, index, navigation}) => {
  const fileOpen = videoId => {
    navigation.navigate('Video View', {
      video_id: videoId,
    });
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      index={index}
      style={{padding: 5, position: 'relative'}}
      onPress={() => {
        fileOpen(item.id);
      }}>
      <View style={{borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', padding: 5}}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={{position: 'absolute', left: '45%', top: '50%'}}
        onPress={() => {
          fileOpen(item.id);
        }}>
        <Ionicon name="play-circle-sharp" size={55} color={'#ffff'} />
      </TouchableOpacity>
        <View style={{ marginBottom: 10}}>
            <Text style={{fontSize: 16 }}>{item.title}</Text>
            <Text style={{fontSize: 16 }}>{item.sub_title}</Text>
        </View>
        <Image
          source={{uri: item.image}}
          resizeMode={'stretch'}
          style={{width: 310, height: 300, zIndex: -1}}
        />
      </View>
    </TouchableOpacity>
  );
};
