import React, {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import SplashScreen from 'react-native-splash-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  Alert,
  Image,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
import {Colors as ThemeColor} from './src/constants/Theme';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {NavigationContainer, useFocusEffect} from '@react-navigation/native';
import UserForm from './src/UserForm';
import MyTabs from './src/CardView/BottomTab';
import AppIntro from './src/components/AppIntro';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ChatScreen} from './src/CardView/ChatListScreen';
import ChatForm from './src/CardView/ChatForm';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';
import OtpVerificationScreen from './src/components/OtpVerification';
import LoginPage from './src/components/LoginPage';
import Terms from './src/components/TermsAndCondition';
import Faq from './src/components/Faq';
import AddCrop from './src/CardView/AddCrop';
import CropProtection from './src/CardView/CropProtection';
import CropDetails from './src/CardView/CropDetails';
import Privacy from './src/components/Privacy';
import FavCrop from './src/CardView/FavCrop';
import axios from 'axios';
import CropProtectionDetail from './src/CardView/CropProtectionDetail';
import NewsDetails from './src/components/NewsDetails';
import {ChatView} from './src/screens/ChatView';
import {useContext} from 'react';
import Config from 'react-native-config';
import AboutUs from './src/components/AboutUs';
import {getHeaderTitle} from '@react-navigation/elements';
import SubscriptionList from './src/components/SubscriptionList';
import Gallery from './src/components/Gallery';
import {translator} from './src/locales/I18n';
import CustomerSubscribedList from './src/components/CustomerSubscribedList';
import CustomerSubscribedDetails from './src/components/CustomerSubscribedDetails';
import NetworkErr from './src/components/NetworkErr';
import {DropDown2} from './src/components/DropDown';
import MobileAds, {MaxAdContentRating} from 'react-native-google-mobile-ads';
import {fcmService} from './src/services/FCMService';
import {localNotificationService} from './src/services/LocalNotificationService';
import {navigate, navigationRef} from './src/services/NotifyNavigateService';
import VideoView from './src/screens/VideoView';
import Videos from './src/screens/Videos';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CropProtectionList from './src/CardView/CropProtectionList';
import News from './src/components/News';

const Drawer = createDrawerNavigator();
const RootStack = createNativeStackNavigator();
const AuthContext = createContext();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [state, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
            user: action.details,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            user: action.details,
          };
        case 'SIGN_OUT':
          AsyncStorageLib.removeItem('amrut_session');
          AsyncStorageLib.removeItem('app_language');
          AsyncStorageLib.removeItem('fcmToken');
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            user: {},
          };
        case 'USER_UPDATE':
          return {
            ...prevState,
            user: action.details,
          };
        case 'UPDATE_LANG':
          return {
            ...prevState,
            language: action.language,
          };
        case 'NETWORK_UPDATE':
          return {
            ...prevState,
            isNetworkAvailable: action.isConnected,
          };
        case 'VERIFICATION_OPTION':
          return {
            ...prevState,
            authVerificationMethod: action.method,
          };
        case 'VERSION_UPDATE':
          return {
            ...prevState,
            AppVersion: action.version,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      user: {},
      language: 'en',
      isNetworkAvailable: false,
      authVerificationMethod: 'password',
      AppVersion:'1.1'
    },
  );

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [displayIntro, setDisplayIntro] = useState(true);

  useEffect(() => {
    MobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
      testDeviceIdentifiers: ['EMULATOR'],
    });
  }, []);
  //   const GetDeviceVersion=async()=>{
  // }, [])

  useEffect(() => {
    const checkIntro = async () => {
      console.log('--called--version-check--');
      let isDisplayIntro = await AsyncStorageLib.getItem('appIntro');
      const appLanguage = (await AsyncStorageLib.getItem('app_language'))
        ? await AsyncStorageLib.getItem('app_language')
        : 'en';
      if (isDisplayIntro && isDisplayIntro === 'success') {
        setDisplayIntro(false);
      }
      let userToken = await AsyncStorageLib.getItem('amrut_session');
      if (userToken === null || userToken === '') {
        setTimeout(() => {
          SplashScreen.hide();
        }, 2000);
        return;
      }
      try {
        console.log('api calling started here');
        // user profile api started
        console.log('user token', userToken, state.userToken);
        const getCustomerApiUrl = `${Config.API_BASE_URL}/customer-details`;
        axios
          .get(getCustomerApiUrl, {headers: {Authorization: userToken}})
          .then(res => {
            if (
              res.data.response[0].language === null ||
              res.data.response[0].language === ''
            ) {
              dispatch({type: 'UPDATE_LANG', language: appLanguage});
            } else {
              dispatch({
                type: 'UPDATE_LANG',
                language: res.data.response[0].language,
              });
            }
            if (res.data.success == true) {
              dispatch({
                type: 'RESTORE_TOKEN',
                token: userToken,
                details: res.data.response[0],
              });
              // fcm notificatication
              fcmService.registerAppWithFCM();
              fcmService.register(
                onRegister,
                onNotification,
                onOpenNotification,
              );
              localNotificationService.configure(onOpenNotification);
              setTimeout(() => {
                SplashScreen.hide();
              }, 1000);
            } else if (
              res.data.message &&
              res.data.message == 'Unauthorized Access'
            ) {
              dispatch({type: 'SIGN_OUT'});
              setTimeout(() => {
                SplashScreen.hide();
              }, 1000);
            } else {
              dispatch({type: 'SIGN_OUT'});
              setTimeout(() => {
                SplashScreen.hide();
              }, 1000);
            }
          })
          .catch(er => {
            dispatch({type: 'SIGN_OUT'});
            dispatch({type: 'UPDATE_LANG', language: appLanguage});
            setTimeout(() => {
              SplashScreen.hide();
            }, 1000);
          });
      } catch {
        console.log('went wrong try');
        dispatch({type: 'SIGN_OUT'});
        setTimeout(() => {
          SplashScreen.hide();
        }, 1000);
      }
    };
    checkIntro();
  }, [state.userToken]);

  const onRegister = async (token, isNew = false) => {
    console.log('onregist user token ', state.userToken);
    if (isNew && state.userToken !== null) {
      const saveDeviceTokenurl = `${Config.API_BASE_URL}/customer-device-registration`;
      axios
        .post(
          saveDeviceTokenurl,
          {device_code: token},
          {headers: {Authorization: state.userToken}},
        )
        .then(async res => {
          console.log('token res ', res.data);
          if (res.data.status == '200') {
            await AsyncStorageLib.setItem('fcmToken', token);
          } else if (
            res.data.message &&
            res.data.message == 'Unauthorized Access'
          ) {
            // dispatch({ type: 'SIGN_OUT' });
            console.log('unauthorized token');
          } else {
            // dispatch({ type: 'SIGN_OUT' });
            console.log('went wrong token');
          }
        })
        .catch(er => {
          console.log('went wrong token 2');
          // dispatch({ type: 'SIGN_OUT' });
        });
    }
  };

  const onNotification = notify => {
    console.log('app notify', notify.notification);
    let options = {
      playSound: true,
      soundName: 'default',
      largeIcon: 'ic_launcher',
      smallIcon: 'ic_launcher',
    };

    localNotificationService.showNotification(
      0,
      notify.notification.title,
      notify.notification.body,
      notify.notification.android.imageUrl,
      notify,
      options,
    );
  };

  const onOpenNotification = async (notify, isLocal = false) => {
    if (notify && notify.data && notify.data.page) {
      setTimeout(() => {
        navigate(notify.data.page, {news_id: notify.data.news_id});
      }, 1000);
    } else if (
      isLocal &&
      notify &&
      notify.data &&
      notify.data.data &&
      notify.data.data.page
    ) {
      navigate(notify.data.data.page, {news_id: notify.data.data.news_id});
    }
  };

  const closeIntro = async () => {
    console.log('--close-intro-called--');
    await AsyncStorageLib.setItem('appIntro', 'success');
    setDisplayIntro(false);
  };

  const authContext = useMemo(
    () => ({
      signIn: async data => {
        dispatch({
          type: 'SIGN_IN',
          token: data.authorization,
          details: data.details,
        });
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async data => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      updateDetail: async data => {
        dispatch({type: 'USER_UPDATE', details: data});
      },
      updateLang: lang => {
        AsyncStorageLib.setItem('app_language', lang);
        dispatch({type: 'UPDATE_LANG', language: lang});
      },
      updateVerifyOption: method => {
        console.log('update login option');
        dispatch({type: 'VERIFICATION_OPTION', method: method});
      },
      updateVersion: version => {
        console.log('update App Version');
        dispatch({type: 'VERSION_UPDATE', version: version});
      },
    }),
    [],
  );

  

  useEffect(() => {
    try {
      axios
        .get(`https://amrutpattern.com/api/get-app-version`, {
          method: 'GET',
        })
        .then(res => {
          if(res.status==200)
            {
              console.log('--aaaaa--',res.data)
              dispatch({
                type: 'VERSION_UPDATE',
                // AppVersion: Platform.OS=='android'?res.data.android:res.data.ios
                version: res.data.version
              })
              // updateVersion(res.data)
            }
          // console.log(res.data);
        })
        .catch(err => {
          console.log('-er-', err);
        });
    } catch (err) {
      console.log('-err-', err);
    }
  }, []);

  return (
    <GestureHandlerRootView>
      <View style={{backgroundStyle, flex: 1}}>
        <StatusBar
          hidden={displayIntro}
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="#e0fff4"
        />

        {displayIntro ? (
          <AppIntro closeIntro={closeIntro} />
        ) : (
          <AuthContext.Provider value={{...authContext, ...state}}>
            <NavigationContainer ref={navigationRef}>
              <RootStack.Navigator
                screenOptions={{
                  headerStyle: {
                    borderBottomWidth: 1,
                    borderBottomColor: 'red',
                    backgroundColor: ThemeColor.secondary,
                    elevation: 2,
                  },
                  headerTintColor: '#fff',
                }}>
                {state.userToken ? (
                  <>
                    <RootStack.Screen
                      name="Home"
                      options={{
                        headerShown: false,
                      }}>
                      {() => (
                        <Drawer.Navigator
                          screenOptions={{
                            headerShown: true,
                            headerStyle: {
                              backgroundColor: ThemeColor.secondary,
                            },
                          }}
                          drawerContent={props => (
                            <CustomDrawerContent
                              {...props}
                              userData={state.user}
                            />
                          )}>
                          <Drawer.Screen
                            name="HomeDrawer"
                            component={MyTabs}
                            options={{
                              title: translator(
                                'navigator.home_title',
                                state.language,
                              ),
                              headerStyle: {
                                borderBottomWidth: 1,
                                borderBottomColor: 'rgba(0,0,0,0.3)',
                                backgroundColor: ThemeColor.secondary,
                              },
                              header: ({navigation, route, options}) => {
                                const title = getHeaderTitle(
                                  options,
                                  route.name,
                                );
                                return (
                                  <MyHeader
                                    title={title}
                                    icon="menu-outline"
                                    navigation={navigation}
                                    style={options.headerStyle}
                                    navigate
                                  />
                                );
                              },
                            }}
                          />
                        </Drawer.Navigator>
                      )}
                    </RootStack.Screen>
                    <RootStack.Screen
                      name="Chats"
                      component={ChatScreen}
                      options={{
                        title: translator('navigator.chat', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="News"
                      component={News}
                      listeners={({ navigation }) => ({
                        tabPress: (e) => {
                          e.preventDefault();
                          navigation.navigate('News', {
                            crop_id: 0
                          });
                        },
                      })}
                      // options={{
                      //   tabBarLab': translator("home.news", language),
                      //   tabBarIcon: ({ color }) => (
                      //     <Ionicons name="newspaper" color={color} size={25} />
                      //   ),
                      // }}
                    />
                    <RootStack.Screen
                      name="ChatView"
                      component={ChatView}
                      options={{
                        header: ({navigation, route}) => (
                          <View
                            style={{
                              borderBottomWidth: 1,
                              borderColor: 'rgba(0,0,0,0.3)',
                              backgroundColor: ThemeColor.secondary,
                              flexDirection: 'row',
                              alignItems: 'center',
                              padding: 10,
                              paddingLeft: 15,
                            }}>
                            <View>
                              <Ionicon
                                name="arrow-back-outline"
                                size={25}
                                color={ThemeColor.white}
                                style={{fontWeight: '500'}}
                                onPress={() => {
                                  navigation.goBack();
                                }}
                              />
                            </View>
                            <View style={{marginLeft: 10}}>
                              <Image
                                source={
                                  route.params.image == null
                                    ? require('./src/assets/defaultCrop.png')
                                    : {uri: route.params.image}
                                }
                                style={{
                                  height: 40,
                                  width: 40,
                                  resizeMode: 'cover',
                                  borderRadius: 50,
                                }}
                              />
                            </View>
                            <Text
                              style={{
                                fontSize: 20,
                                color: ThemeColor.white,
                                justifyContent: 'space-around',
                                marginLeft: 10,
                              }}>
                              {route.params.crop_name}{' '}
                            </Text>
                          </View>
                        ),
                      }}
                    />
                    <RootStack.Screen
                      name="ChatForm"
                      component={ChatForm}
                      options={{
                        title: translator('navigator.newChat', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="Account Details"
                      component={UserForm}
                      options={{
                        title: translator('navigator.account', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="Terms"
                      component={Terms}
                      options={{
                        title: translator('navigator.term', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="Frequently Asked Questions"
                      component={Faq}
                      options={{
                        title: translator('navigator.faq', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="AddCrop"
                      component={AddCrop}
                      options={{
                        title: translator('navigator.crops', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="About Crop"
                      component={CropDetails}
                      options={{
                        title: translator(
                          'navigator.crop_detail',
                          state.language,
                        ),
                      }}
                    />
                    <RootStack.Screen
                      name="Privacy"
                      component={Privacy}
                      options={{
                        title: translator('navigator.privacy', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="FavCrop"
                      component={FavCrop}
                      options={{
                        title: translator('navigator.my_crops', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="Crops Protection Details"
                      component={CropProtectionDetail}
                      options={{
                        title: translator(
                          'navigator.protection',
                          state.language,
                        ),
                      }}
                    />
                    <RootStack.Screen
                      name="CropsProtection"
                      component={CropProtection}
                      options={{
                        title: translator('navigator.my_crops', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="CropsProtectionList"
                      component={CropProtectionList}
                      options={{
                        title: translator('navigator.my_crops', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="News Description"
                      component={NewsDetails}
                      options={{
                        title: translator(
                          'navigator.news_detail',
                          state.language,
                        ),
                      }}
                    />
                    <RootStack.Screen
                      name="Videos"
                      component={Videos}
                      options={{
                        title: translator('home.videos', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="Video View"
                      component={VideoView}
                      options={{headerShown: false}}
                    />
                    <RootStack.Screen
                      name="About us"
                      component={AboutUs}
                      options={{
                        title: translator('navigator.about', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="Subscription List"
                      component={SubscriptionList}
                      options={{
                        title: translator(
                          'navigator.subscription_list',
                          state.language,
                        ),
                        header: ({navigation, route, options}) => {
                          // const title = getHeaderTitle(options, route.name);
                          // console.log("option option", options);
                          return (
                            <View
                              style={{
                                borderBottomWidth: 1,
                                borderColor: 'rgba(0,0,0,0.3)',
                                backgroundColor: ThemeColor.secondary,
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 12,
                                paddingLeft: 15,
                              }}>
                              <View style={{width: '10%'}}>
                                <Ionicon
                                  name="arrow-back-outline"
                                  size={25}
                                  color={ThemeColor.white}
                                  style={{fontWeight: '500'}}
                                  onPress={() => {
                                    navigation.goBack();
                                  }}
                                />
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  width: '90%',
                                }}>
                                <Text
                                  style={{
                                    fontSize: 20,
                                    color: ThemeColor.white,
                                  }}>
                                  {options.title}{' '}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}>
                                  <FontAwesome5
                                    name="plus"
                                    size={30}
                                    color={ThemeColor.white}
                                    style={{fontWeight: '500', marginRight: 20}}
                                    onPress={() => {
                                      navigation.navigate('AddCrop');
                                    }}
                                  />
                                  <Ionicon
                                    name="list"
                                    size={30}
                                    color={ThemeColor.white}
                                    style={{fontWeight: '500'}}
                                    onPress={() => {
                                      navigation.navigate(
                                        'Purchased Subscription',
                                      );
                                    }}
                                  />
                                </View>
                                {/* <Text style={{ fontSize: 20, color: ThemeColor.white, }} onPress={() => { navigation.navigate('Purchased Subscription'); }}>History</Text> */}
                              </View>
                            </View>
                          );
                        },
                      }}
                    />
                    <RootStack.Screen
                      name="gallery"
                      component={Gallery}
                      options={{
                        title: translator('navigator.gallery', state.language),
                      }}
                    />
                    <RootStack.Screen
                      name="Purchased Subscription"
                      component={CustomerSubscribedList}
                      options={{
                        title: translator(
                          'navigator.Payment_List',
                          state.language,
                        ),
                      }}
                    />
                    <RootStack.Screen
                      name="Subscription Details"
                      component={CustomerSubscribedDetails}
                      options={{
                        title: translator(
                          'navigator.Subscribed_Details',
                          state.language,
                        ),
                      }}
                    />
                  </>
                ) : (
                  <>
                    <RootStack.Screen
                      name="LoginForm"
                      component={LoginPage}
                      options={{
                        title: translator('navigator.login', state.language),
                        headerShown: false,
                      }}
                    />
                    <RootStack.Screen
                      name="OtpVerify"
                      component={OtpVerificationScreen}
                      options={{
                        title: translator('navigator.otp', state.language),
                        headerShown: false,
                      }}
                    />
                  </>
                )}
              </RootStack.Navigator>
              {Config.Is_prod == false && (
                <View
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: -30,
                    zIndex: 1,
                    width: 120,
                    backgroundColor: '#de2626',
                    padding: 5,
                    transform: [{rotate: '45deg'}],
                  }}>
                  <Text
                    style={{
                      color: ThemeColor.white,
                      fontSize: 14,
                      textAlign: 'center',
                    }}>
                    * DEV
                  </Text>
                </View>
              )}
            </NavigationContainer>
          </AuthContext.Provider>
        )}
        <NetworkErr dispatch={dispatch} />
      </View>
    </GestureHandlerRootView>
  );
};

function MyHeader(data) {
  let {navigation, title} = data;
  let {updateLang, language} = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const languageChanged = e => {
    updateLang(e);
  };

  return (
    <>
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: 'rgba(0,0,0,0.3)',
          backgroundColor: ThemeColor.secondary,
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 10,
          paddingLeft: 15,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View>
            <Ionicon
              name="menu-outline"
              size={30}
              color={ThemeColor.white}
              onPress={() => {
                navigation.toggleDrawer();
              }}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: 20,
                color: ThemeColor.white,
                justifyContent: 'space-around',
                marginLeft: 15,
              }}
              onPress={() => {
                navigation.navigate('About us');
              }}>
              {' '}
              {title}{' '}
            </Text>
          </View>
        </View>
        <View>
          <Ionicon
            name="language"
            size={30}
            color={ThemeColor.white}
            onPress={() => {
              setIsVisible(true);
            }}
          />
          {/* <Text onPress={() => { setIsVisible(true) }}>
						Hello
					</Text> */}
          {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 15 }}> */}
          <Modal
            transparent={false}
            visible={isVisible}
            statusBarTranslucent={true}
            onRequestClose={() => {
              setIsVisible(false);
            }}
            animationType="fade">
            <View
              style={{flex: 1, justifyContent: 'center', marginHorizontal: 15}}>
              <Text>{translator('language.select_language', language)}</Text>
              <DropDown2
                name="language"
                value={language}
                dropdown={[
                  {id: 'en', name: 'English'},
                  {id: 'hi', name: 'Hindi'},
                  {id: 'mr', name: 'Marathi'},
                ]}
                onChange={languageChanged}
              />
              <TouchableOpacity
                onPress={() => {
                  setIsVisible(false);
                }}>
                <View
                  style={{
                    backgroundColor: ThemeColor.secondary,
                    alignItems: 'center',
                    padding: 15,
                    borderRadius: 10,
                  }}>
                  <Text style={{color: ThemeColor.white, fontSize: 20}}>
                    {translator('language.ok', language)}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* </View> */}
        </View>
      </View>
    </>
  );
}

function CustomDrawerContent(data) {
  let {navigation, userData, ...props} = data;
  let {signOut, language} = useContext(AuthContext);
  return (
    <>
      <View
        style={{
          backgroundColor: ThemeColor.secondary,
          height: 200,
          marginTop: -5,
          justifyContent: 'center',
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Account Details');
          }}>
          <View
            style={{
              flex: 1,
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderStyle: 'solid',
                borderColor: '#000',
                borderWidth: 1,
                padding: 20,
                borderRadius: 50,
                marginBottom: 5,
                backgroundColor: ThemeColor.white,
              }}>
              <FontAwesome5
                name="user-alt"
                size={50}
                color={ThemeColor.secondary}
              />
            </View>
            {data.userData && data.userData.name && (
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 10,
                  paddingBottom: 5,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: ThemeColor.white,
                    fontSize: 17,
                    paddingEnd: 8,
                  }}>
                  {data.userData.name}
                </Text>
                <FontAwesome5 name="edit" size={15} color={ThemeColor.white} />
              </View>
            )}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{color: ThemeColor.white, fontSize: 17, paddingEnd: 8}}>
                {data.userData ? data.userData.mobile : ''}
              </Text>
              {data.userData && !data.userData.name && (
                <FontAwesome5 name="edit" size={15} color={ThemeColor.white} />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          label={translator('navigator.about', language)}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('About us');
          }}
          style={{
            marginVertical: -3,
          }}
          labelStyle={{
            fontSize: 16,
            marginStart: -15,
            fontWeight: 'normal',
          }}
          icon={() => <Ionicon name="information-circle-sharp" size={20} />}
        />
        <DrawerItem
          label={translator('navigator.chat', language)}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Chats');
          }}
          style={{
            marginVertical: -3,
          }}
          labelStyle={{
            fontSize: 16,
            marginStart: -15,
            fontWeight: 'normal',
          }}
          icon={() => <Ionicon name="chatbubble-ellipses-sharp" size={20} />}
        />
        <DrawerItem
          label={translator('navigator.news', language)}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('News');
          }}
          style={{
            marginVertical: -3,
          }}
          labelStyle={{
            fontSize: 16,
            marginStart: -15,
            fontWeight: 'normal',
          }}
          icon={() => <Ionicon name="notifications" size={20} />}
        />
        <DrawerItem
          label={translator('navigator.drawerfaq', language)}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Frequently Asked Questions');
          }}
          style={{
            marginVertical: -3,
          }}
          labelStyle={{
            fontSize: 16,
            marginStart: -15,
            fontWeight: 'normal',
          }}
          icon={() => <Ionicon name="bookmarks" size={20} />}
        />
        <DrawerItem
          label={translator('navigator.term', language)}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Terms');
          }}
          style={{
            marginVertical: -3,
          }}
          labelStyle={{
            fontSize: 16,
            marginStart: -15,
            fontWeight: 'normal',
          }}
          icon={() => <Ionicon name="newspaper" size={20} />}
        />
        <DrawerItem
          label={translator('navigator.privacy', language)}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('Privacy');
          }}
          style={{
            marginVertical: -3,
          }}
          labelStyle={{
            fontSize: 16,
            marginStart: -15,
            fontWeight: 'normal',
          }}
          icon={() => <Ionicon name="book-sharp" size={20} />}
        />
        <DrawerItem
          label={translator('navigator.gallery', language)}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('gallery');
          }}
          style={{
            marginVertical: -3,
          }}
          labelStyle={{
            fontSize: 16,
            marginStart: -15,
            fontWeight: 'normal',
          }}
          icon={() => <FontAwesome name="file-photo-o" size={20} />}
        />
        <DrawerItem
          label={translator('navigator.log_out', language)}
          onPress={() =>
            Alert.alert(
              translator('navigator.log_out', language),
              translator('navigator.logout_text', language),
              [
                {
                  text: translator('navigator.yes', language),
                  onPress: () => {
                    AsyncStorageLib.removeItem('amrut_session');
                    signOut();
                  },
                },
                {text: translator('navigator.no', language)},
              ],
            )
          }
          style={{
            marginVertical: -3,
          }}
          labelStyle={{
            fontSize: 16,
            marginStart: -15,
            fontWeight: 'normal',
          }}
          icon={() => <Ionicon name="log-out-outline" size={20} />}
        />
      </DrawerContentScrollView>
      <View style={{marginLeft: 5}}>
        <Text style={styles.version}>{Config.versionName}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sliderTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  sliderDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    paddingStart: 30,
    paddingEnd: 30,
  },
  sliderImage: {
    width: 240,
    height: 280,
    resizeMode: 'stretch',
  },
  highlight: {
    fontWeight: '700',
  },
  sliderButton: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
  },
  version: {
    fontSize: 14,
    padding: 4,
    fontWeight: '500',
  },
});

export default App;
export {AuthContext};
