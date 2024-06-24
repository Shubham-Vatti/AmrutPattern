import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  Text,
  button,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  RefreshControl,
  FlatList,
} from 'react-native';
// import { Card } from 'react-native-elements';
import {Card} from '@rneui/themed';
import {ScrollView} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import {Colors} from '../constants/Theme';
import {useIsFocused} from '@react-navigation/native';
import axios from 'axios';
import {AuthContext} from '../../App';
import {FacebookLoader} from 'react-native-easy-content-loader';
import Config from 'react-native-config';
import {translator} from '../locales/I18n';

const FavCropList = props => {
  const {item, token, deleteCrop, navigation, language} = props;

  const click = (item, itemimage, itemtitle) => {
    navigation.navigate('About Crop', {
      crop_id: item,
      crop_image: itemimage,
      Crop_title: itemtitle,
    });
  };
  const noSubscribe = () => {
    ToastAndroid.showWithGravityAndOffset(
      'You don`t have subscription for this crops, please subscribe for more details...',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      0,
      200,
    );
  };

  return (
    <>
      <View style={{alignItems: 'center', marginHorizontal: 15}}>
        {
          <View style={styles.cardbody}>
            <View style={styles.mainContainer}>
              <View style={styles.subContainer}>
                <Card.Image
                  source={{uri: item.image}}
                  style={styles.cardimg}
                  // onPress={item.subscriptionDaysLeft > 0 ? () => click(item.crop_id, item.image, item.title) : () => noSubscribe()}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    marginStart: 15,
                    marginEnd: 5,
                    fontSize: 18,
                  }}
                  // onPress={item.subscriptionDaysLeft > 0 ? () => click(item.crop_id, item.image, item.title) : () => noSubscribe()}
                >
                  {item.title}
                </Text>
              </View>
              <View>
                {item.subscriptionDaysLeft > 0 ? (
                  // <Text style={{ fontSize: 16, fontWeight: '500', color: Colors.secondary }} >{ translator("my_crop.subscribed", language)}</Text>
                  <Ionicons
                    name="checkmark"
                    size={30}
                    color={Colors.secondary}
                  />
                ) : (
                  <AntDesign
                    name="delete"
                    size={25}
                    onPress={() =>
                      Alert.alert(
                        translator('my_crop.delete', language),
                        translator('my_crop.delete_text', language),
                        [
                          {
                            text: translator('my_crop.yes', language),
                            onPress: () => {
                              deleteCrop(item.id);
                            },
                          },
                          {
                            text: translator('my_crop.no', language),
                            style: 'cancel',
                          },
                        ],
                      )
                    }
                  />
                )}
              </View>
            </View>
          </View>
        }
      </View>
    </>
  );
};

function FavCrop({navigation}) {
  const [cropsData, setcropsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const {signOut, language, isNetworkAvailable,AppVersion} = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  const [token, setToken] = useState();
  useEffect(() => {
    const getToken = async () => {
      let checkToken = await AsyncStorageLib.getItem('amrut_session');
      setToken(checkToken);
      if (checkToken == null) {
        signOut();
        return;
      }
      const getApiUrl = `${Config.API_BASE_URL}/customer-crops-list?language=${language}&version=${AppVersion}`;
      axios
        .get(getApiUrl, {headers: {Authorization: checkToken}})
        .then(res => {
          if (res.data.success == true) {
            setcropsData(res.data.response);
          } else {
            setcropsData([]);
            // ToastAndroid.show("Somthing went Wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
          }
          // setCropsListApi(true);
          setLoading(true);
          // console.log(res.data);
        })
        .catch(function (error) {
          // handle error
          // alert(error.message);
        });
    };
    getToken();
  }, [isFocused, refreshing, isNetworkAvailable]);
  // console.log("cropsData", cropsData);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      setRefreshing(false);
      ToastAndroid.show('Refreshed', ToastAndroid.SHORT, ToastAndroid.CENTER);
    });
  }, []);

  const deleteCrop = item => {
    const deleteCropApiUrl = `${Config.API_BASE_URL}/delete/customer-crop`;
    axios
      .post(deleteCropApiUrl, {id: item}, {headers: {Authorization: token}})
      .then(res => {
        if (res.data.success == true) {
          let newCrop = cropsData.filter(data => {
            return data.id !== item;
          });
          setcropsData(newCrop);
          ToastAndroid.show(
            'Crop removed successfully',
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            500,
          );
        } else {
          ToastAndroid.show(
            'Something went wrong',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
      })
      .catch(function (error) {
        // alert(error.message);
        ToastAndroid.show(
          'Something went wrong',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.bodybackground}}>
        {loading?<FlatList
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        data={cropsData}
        renderItem={({item,index})=>{
            return(
                <FavCropList
                  item={item}
                  key={index}
                  token={token}
                  deleteCrop={deleteCrop}
                  navigation={navigation}
                  language={language}
                />

            )
        }}
        ListEmptyComponent={()=>{
            return(
            <View style={{alignItems: 'center'}}>
            <Text style={styles.message}>
              {' '}
              {translator('my_crop.no_crop', language)}
            </Text>
          </View>
            )
        }}
        
        />:<View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 20,
        }}>
        <Text
          style={{fontSize: 18, padding: 5, marginHorizontal: 15}}></Text>
        <FacebookLoader active avatar pRows={0} />
        <FacebookLoader active avatar pRows={0} />
        <FacebookLoader active avatar pRows={0} />
      </View>}
      

      {loading ? (
        <View>
          <TouchableOpacity
            activeOpacity={2}
            style={styles.button}
            onPress={() => {
              navigation.navigate('AddCrop');
            }}>
            <Text style={styles.buttontext}>
              {translator('my_crop.add_crop', language)}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondary,
    padding: 10,
    justifyContent: 'center',
    borderRadius: 7,
    // marginTop: 8,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  finishbtn: {
    // backgroundColor: Colors.white,
    padding: 10,
    justifyContent: 'center',
    borderRadius: 10,
    // marginTop: 8,
    marginHorizontal: 15,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  buttontext: {
    color: Colors.white,
    fontSize: 20,
    textAlign: 'center',
  },
  finishtext: {
    color: Colors.secondary,
    fontSize: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
    marginTop: 250,
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10,
  },
  subContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
  },
  cardimg: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  cardbody: {
    margin: 4,
    padding: 4,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    shadowColor: Colors.secondary,
    borderWidth: 1,
    borderColor: '#c3c3c3',
    // boxShadow: "10px 10px 17px -12px rgba(0,0,0,0.75)",
    shadowOffset: {
      width: 1,
      height: -0.7,
    },
  },
  ActivityIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    padding: 20,
  },
});

export default FavCrop;
