import React, {useCallback, useContext, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {AuthContext} from '../../App';
import {Card} from '@rneui/themed';
// import { Card } from 'react-native-elements';
// import { CheckBox } from '@rneui/themed';/
// import CheckBox from '@react-native-community/checkbox';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {FacebookLoader} from 'react-native-easy-content-loader';
import Config from 'react-native-config';
import axios from 'axios';
import {Colors} from '../constants/Theme';
import RazorpayCheckout from 'react-native-razorpay';
import {translator} from '../locales/I18n';

const SubscriptionShow = props => {
  const {
    item,
    control,
    onChange,
    selectedCrops,
    deleteCrop,
    token,
    cropsData,
    setcropsData,
    setSelectedCrops,
    setTotal,
  } = props;
  const {signOut, language, isNetworkAvailable,AppVersion} = useContext(AuthContext);
  const takeSubscription = cropid => {
    // setTimeout(()=> {
    let order_Id_url = `${Config.API_BASE_URL}/create-order-id?language=${language}&version=${AppVersion}`;
    axios
      .post(
        order_Id_url,
        {crop_list: cropid},
        {headers: {Authorization: token}},
      )
      .then(res => {
        // console.log("res", res.data.response.id, res.data.response.amount)
        console.log('selected crops', cropid);
        if (res.data.success === true) {
          razor_checkout(
            res.data.response.id,
            res.data.response.amount,
            cropid,
          );
        } else if (
          res.data.message &&
          res.data.message == 'Unauthorized Access'
        ) {
          ToastAndroid.show(
            'Your session is expired, please login again',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
          signOut();
        } else {
          ToastAndroid.show(
            'Something went wrong',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
        }
      })
      .catch(err => {
        console.log('err', err);
        ToastAndroid.show(
          'Something went wrong',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      });
    // }, 3000)
  };

  const razor_checkout = (order_id, amount, cropid) => {
    let option = {
      description: 'Credits towards consultation',
      currency: 'INR',
      key: Config.Is_prod == 'true' ? Config.Live : Config.Test,
      // key: Config.Live,
      amount: amount,
      name: 'Amrut Pattern',
      order_id: order_id,
    };
    console.log('environment ', Config.Is_prod, option);

    // razorpay screen open
    RazorpayCheckout.open(option)
      .then(res => {
        console.log('razorpay success - ', res);
        let newCrops = cropsData.filter(item => {
          if (cropid[0] == item.crop_id) {
            item.subscribed = 1;
            item.subscriptionDaysLeft = 364;
            console.log('return item', item);
            return item;
          } else {
            return item;
          }
        });
        setcropsData(newCrops);
        setSelectedCrops([]);
        setTotal(0);
        ToastAndroid.show(
          'Payment Successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      })
      .catch(er => {
        if (er.code && er.code === 0) {
          ToastAndroid.show(
            'Payment cancelled',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
        } else {
          console.log('optionoptionoption', option);
          console.log('erererererer', er);
          ToastAndroid.show(
            'Somthing went wrong',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
        }
      });
  };

  return (
    <>
      <View
        style={{alignItems: 'center', marginHorizontal: 15, marginVertical: 5}}>
        <View style={styles.cardbody}>
          <View style={styles.mainContainer}>
            <View style={styles.subContainer}>
              <Card.Image source={{uri: item.image}} style={styles.cardimg} />
              <Text
                style={{
                  alignSelf: 'center',
                  marginStart: 15,
                  fontSize: 18,
                  flexWrap: 'wrap',
                  width: '50%',
                }}>
                {item.title}{' '}
              </Text>
            </View>
            {/* <Text style={{ alignSelf: 'center', textAlign: 'center', flexWrap: 'wrap', fontSize: 16, }}> ₹ {item.subs_yearly_charges}.00 /Yrs. </Text> */}
            <View style={styles.subContainer}>
              <View style={{marginRight: 20}}>
                {
                  item.subscribed !== 1 && (
                    <TouchableOpacity
                      onPress={() => takeSubscription([item.crop_id])}>
                      <Text
                        style={{
                          backgroundColor: Colors.secondary,
                          color: 'white',
                          fontSize: 15,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 4,
                        }}>
                        {translator('subscription.PaymentBtn', language)}
                      </Text>
                      {/* <AntDesign name="arrowright" size={24} color="black" /> */}
                    </TouchableOpacity>
                  )
                  // <CheckBox
                  // checked={selectedCrops.includes(item.crop_id) ? true : false}
                  //     // name={`crop_${item.crop_id}`}
                  //     // value=
                  //     onPress={() => onChange(item.crop_id, item.subs_yearly_charges)}
                  // />
                }
              </View>
            </View>
          </View>
          <View
            style={{alignItems: 'flex-end', paddingBottom: 5, paddingRight: 2}}>
            {/* <Text style={{ padding: 5, width }}>Expiry Date - {item.subs_end_date} </Text>
                            <Text>|</Text> */}
            {/* <Text>Days Left - 327 days</Text> */}
            <Text style={{fontSize: 14}}>
              {' '}
              {item.subscribed == 1
                ? `${translator('subscription.paid', language)} - ₹ ${
                    item.subs_yearly_charges
                  }.00 / ${item.subs_period} ` +
                  translator('subscription.days', language)
                : `${translator('subscription.price', language)} - ₹ ${
                    item.subs_yearly_charges
                  }.00 / ${item.subs_period} ` +
                  translator('subscription.days', language)}{' '}
            </Text>
          </View>
          <View
            style={
              item.subscribed == 1
                ? styles.subscribeEnabled
                : styles.subscribeDesabled
            }>
            <Text
              style={{
                color: Colors.white,
                padding: 4,
                paddingLeft: 8,
                fontSize: 18,
              }}>
              {' '}
              {item.subscribed == 1
                ? translator('subscription.subscribed', language)
                : translator('subscription.not_subscribed', language)}{' '}
            </Text>
            {item.subscriptionDaysLeft > 0 ? (
              <Text
                style={{
                  color: Colors.white,
                  padding: 4,
                  paddingRight: 8,
                  fontSize: 16,
                }}>
                {' '}
                {item.subscriptionDaysLeft +
                  translator('subscription.expire', language)}
              </Text>
            ) : (
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  marginRight: 30,
                  marginVertical: 4,
                }}
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
                }>
                <MaterialIcons name="delete" color={'#c70e08'} size={25} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

function SubscriptionList({navigation}) {
  const {control, handleSubmit} = useForm({});

  const [cropsData, setcropsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const {signOut, language, isNetworkAvailable,AppVersion} = useContext(AuthContext);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [total, setTotal] = useState(0);
  const onChange = (crop_id, amount) => {
    if (selectedCrops.includes(crop_id)) {
      let index = selectedCrops.indexOf(crop_id);
      selectedCrops.splice(index, 1);
      setTotal(total - amount);
    } else {
      selectedCrops.push(crop_id);
      setTotal(total + amount);
    }
    setSelectedCrops([...selectedCrops]);
  };

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
        // alert(error.message);
      });
  };
  useFocusEffect(
    useCallback(() => {
      getToken();
    }, [isNetworkAvailable]),
  );
  const takeSubscription = () => {
    // setTimeout(()=> {
    let order_Id_url = `${Config.API_BASE_URL}/create-order-id?language=${language}&version=${AppVersion}`;
    axios
      .post(
        order_Id_url,
        {crop_list: selectedCrops},
        {headers: {Authorization: token}},
      )
      .then(res => {
        console.log('res', res);
        console.log('selected crops', selectedCrops);
        if (res.data.success === true) {
          razor_checkout(res.data.response.id, res.data.response.amount);
        } else if (
          res.data.message &&
          res.data.message == 'Unauthorized Access'
        ) {
          ToastAndroid.show(
            'Your session is expired, please login again',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
          signOut();
        } else {
          ToastAndroid.show(
            'Something went wrong',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
        }
      })
      .catch(err => {
        console.log('err', err);
        ToastAndroid.show(
          'Something went wrong',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      });
    // }, 3000)
  };

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

  const razor_checkout = (order_id, amount) => {
    let option = {
      description: 'Credits towards consultation',
      currency: 'INR',
      key: Config.Is_prod == 'true' ? Config.Live : Config.Test,
      // key: Config.Live,
      amount: amount,
      name: 'Amrut Pattern',
      order_id: order_id,
    };
    console.log('environment ', Config.Is_prod, option);

    // razorpay screen open
    RazorpayCheckout.open(option)
      .then(res => {
        console.log('razorpay success - ', res);
        let newCrops = cropsData.filter(item => {
          if (selectedCrops.includes(item.crop_id)) {
            item.subscribed = 1;
            item.subscriptionDaysLeft = 364;
            console.log('return item', item);
            return item;
          } else {
            return item;
          }
        });
        setcropsData(newCrops);
        setSelectedCrops([]);
        setTotal(0);
        ToastAndroid.show(
          'Payment Successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      })
      .catch(er => {
        if (er.code && er.code === 0) {
          ToastAndroid.show(
            'Payment cancelled',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
        } else {
          console.log('optionoptionoption', option);
          console.log('erererererer', er);
          ToastAndroid.show(
            'Somthing went wrong',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
        }
      });
  };
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      getToken()
    }, 1600);
  }, []);

  return (
    <>
      {loading ? (
        <>
          {cropsData.length > 0 ? (
            <>
              <FlatList
                data={cropsData}
                refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={()=>onRefresh()}
                />}
                renderItem={({index, item}) => {
                  return (
                    <SubscriptionShow
                      item={item}
                      key={index}
                      control={control}
                      onChange={onChange}
                      selectedCrops={selectedCrops}
                      deleteCrop={deleteCrop}
                      language={language}
                      token={token}
                      cropsData={cropsData}
                      setcropsData={setcropsData}
                      setSelectedCrops={setSelectedCrops}
                      setTotal={setTotal}
                    />
                  );
                }}
              />
              {/* <ScrollView>
                                        {
                                            cropsData.map((item, index) => (
                                                <SubscriptionShow item={item} key={index} control={control} onChange={onChange} selectedCrops={selectedCrops} deleteCrop={deleteCrop} language={language} token={token} cropsData={cropsData} setcropsData={setcropsData} setSelectedCrops={setSelectedCrops} setTotal={setTotal}/>
                                            ))
                                        }
                                    </ScrollView> */}
              {/* <View style={{ alignItems: "center", marginHorizontal: 15 }}> */}
              {/* <TouchableOpacity
                                            activeOpacity={2}
                                            style={[styles.button, { width: "89%", backgroundColor: "#045fb5" }]}
                                            onPress={() => {
                                              
                                    navigation.navigate('AddCrop');
                                            }}
                                        >
                                            <Text style={styles.buttontext}>
                                                {translator("my_crop.add_crop", language)}
                                            </Text>
                                        </TouchableOpacity> */}
              {/* <View style={{ width: "49%" }} pointerEvents={total > 0 ? "auto" : "none"}>
                                            <TouchableOpacity activeOpacity={2} style={selectedCrops.length > 0 ? styles.button : styles.desabledbtn} onPress={takeSubscription}  >
                                                <Text style={styles.buttontext}
                                                >
                                                    {translator("subscription.button", language)} {total && selectedCrops.length > 0 ? ` ₹ ${total}` : null}
                                                </Text>
                                            </TouchableOpacity>
                                        </View> */}
              {/* </View> */}
            </>
          ) : (
            <>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 10,
                  flex: 1,
                }}>
                <Text style={{fontSize: 18, textAlign: 'center'}}>
                  {translator('my_crop.no_crop', language)}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={2}
                style={[
                  styles.button,
                  {backgroundColor: '#045fb5', marginHorizontal: 15},
                ]}
                onPress={() => {
                  navigation.navigate('AddCrop');
                }}>
                <Text style={styles.buttontext}>
                  {translator('my_crop.add_crop', language)}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 20,
          }}>
          <Text style={{fontSize: 18, padding: 5, marginHorizontal: 15}}></Text>
          <FacebookLoader active avatar pRows={2} />
          <FacebookLoader active avatar pRows={2} />
          <FacebookLoader active avatar pRows={2} />
          <FacebookLoader active avatar pRows={2} />
          <FacebookLoader active avatar pRows={2} />
          <FacebookLoader active avatar pRows={2} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  buttontext: {
    color: Colors.white,
    fontSize: 18,
    textAlign: 'center',
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    padding: 2,
  },
  subContainer: {
    flexDirection: 'row',
  },
  cardimg: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  cardbody: {
    margin: 4,
    paddingTop: 4,
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
  subscribeEnabled: {
    backgroundColor: Colors.secondary,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subscribeDesabled: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 10,
    // marginTop: 8,
    // marginHorizontal: 2,
    marginVertical: 15,
  },
  desabledbtn: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 10,
    justifyContent: 'center',
    borderRadius: 10,
    marginVertical: 15,
    pointerEvents: 'none',
  },
});

export default SubscriptionList;
