import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
// import { Icon, ListItem } from 'react-native-elements';
import {Icon, ListItem} from '@rneui/themed';
import CarouselCards from './CarouselCards';
import {Colors} from '../constants/Theme';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RenderHtml from 'react-native-render-html';
import Config from 'react-native-config';
import {AuthContext} from '../../App';
import Swiper from 'react-native-swiper';

export default function CropProtectionDetail({route}) {
  // console.log(route)
  const {protection_id} = route.params;
  // console.log("protection id",protection_id)

  // const [protectionList, setprotectionList] = useState([...protectionDetails]);
  // const toggleDropdown = (index) => {
  //     protectionList[index].isVisible = !protectionList[index].isVisible;
  //     setprotectionList([...protectionList]);
  // };

  const [proDetails, setProDetails] = useState('');
  const [expanded, setExpanded] = useState('');
  const {width} = useWindowDimensions();
  const {signOut, language, isNetworkAvailable,AppVersion} = useContext(AuthContext);
  const [scopesource, setsource] = useState();
  useEffect(() => {
    const getToken = async () => {
      // alert(protection_id)
      if (protection_id) {
        let checkToken = await AsyncStorageLib.getItem('amrut_session');
        if (checkToken == null) {
          signOut();
          return;
        }

        const getProtectionDetailsApiUrl = `${Config.API_BASE_URL}/crop-protection/detail/${protection_id}?language=${language}&version=${AppVersion}`;
        axios
          .get(getProtectionDetailsApiUrl, {
            headers: {Authorization: checkToken},
          })
          .then(res => {
            if (res.data.success == true) {
              let data = res.data.response;
              setsource({
                html: res.data.response.description,
              })
              // data.slider_image =data.slider_image.split(",");
              setProDetails(data);
            } else {
              alert('Error');
            }
          })
          .catch(e => {
            // alert(e)
          });
      }
    };
    getToken();
  }, [protection_id, isNetworkAvailable]);

  useEffect(() => {
    console.log(proDetails);
  }, [proDetails, isNetworkAvailable]);

//   const source = {
//     html: `
//       <p style='text-align:center;'>
//         Hello World!
//       </p>`,
//   };

  return (
    <ScrollView>
      <View>
        {
          proDetails.slider_images && (
            <Swiper
              style={styles.wrapper}
              showsPagination={true}
              autoplay={true}
              autoplayTimeout={5}
              loop={true}
              // showsButtons={true}
              dot={
                <View
                  style={{
                    backgroundColor: 'white',
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3,
                  }}
                />
              }
              activeDot={
                <View
                  style={{
                    backgroundColor: Colors.secondary,
                    width: 18,
                    height: 8,
                    borderRadius: 4,
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3,
                  }}
                />
              }>
              {JSON.parse(proDetails?.slider_images)?.map(item => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {}}
                    // key={index}
                  >
                    <Image
                      source={{uri: Config.BASE_URL + item}}
                      style={{width: '100%', height: 300}}
                    />
                  </TouchableOpacity>
                );
              })}
            </Swiper>
          )
          // <CarouselCards itemImg ={proDetails.slider_images} />
        }
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.title}>{proDetails.title}</Text>
        {/* <Text style={styles.title}>{proDetails.description}</Text> */}
        {/* <RenderHtml contentWidth={width} source={scopesource} /> */}
                  <RenderHtml
                    contentWidth={width}
                    source={{html: proDetails.description}}
                  />

        <View style={styles.subContainer}>
          {proDetails.short_description && (
            <ListItem.Accordion
              content={
                <ListItem.Content>
                  <ListItem.Title>Short Description</ListItem.Title>
                </ListItem.Content>
              }
              isExpanded={expanded === 'short_desc'}
              onPress={() => {
                if (expanded === 'short_desc') {
                  setExpanded('');
                } else {
                  setExpanded('short_desc');
                }
              }}>
              <ListItem>
                <ListItem.Content
                  style={{flex: 1, flexWrap: 'wrap', width: '100%'}}>
                  <RenderHtml
                    contentWidth={width}
                    source={{html: proDetails.short_description}}
                  />
                </ListItem.Content>
                {/* <ListItem.Title style={{textAlign: 'justify', width: '100%'}}>I was dealing with a custom card component, and these solutions didn't work. For me it was necessary to define a constant width size to my content container (I use Dimensions width).</ListItem.Title> */}
              </ListItem>
            </ListItem.Accordion>
          )}
        </View>

        <View style={styles.subContainer}>
          {proDetails.symptoms && (
            <ListItem.Accordion
              content={
                <ListItem.Content>
                  <ListItem.Title> Symptoms</ListItem.Title>
                </ListItem.Content>
              }
              isExpanded={expanded === 'symptoms'}
              onPress={() => {
                console.log(!expanded);
                // alert(expanded)
                if (expanded === 'symptoms') {
                  setExpanded('');
                } else {
                  setExpanded('symptoms');
                }
              }}>
              <ListItem>
                <ListItem.Content style={{margin: 10}}>
                  <RenderHtml
                    style={{padding: 5}}
                    contentWidth={width}
                    source={{html: proDetails.symptoms}}
                  />
                </ListItem.Content>
              </ListItem>
            </ListItem.Accordion>
          )}
        </View>

        <View style={styles.subContainer}>
          {proDetails.preventive_measures && (
            <ListItem.Accordion
              content={
                <ListItem.Content>
                  <ListItem.Title> Preventive Measures</ListItem.Title>
                </ListItem.Content>
              }
              isExpanded={expanded === 'preventive'}
              onPress={() => {
                console.log(!expanded);
                // alert(expanded)
                if (expanded === 'preventive') {
                  setExpanded('');
                } else {
                  setExpanded('preventive');
                }
              }}>
              <ListItem>
                <ListItem.Content>
                  <RenderHtml
                    contentWidth={width}
                    source={{html: proDetails.preventive_measures}}
                  />
                </ListItem.Content>
              </ListItem>
            </ListItem.Accordion>
          )}

          {/* It will use  */}
          {/* <View>
                        <Text style={{ fontSize: 18, textAlign: 'center', backgroundColor: Colors.secondary, color: Colors.white, marginHorizontal: '20%', alignItems: 'center', padding: 5 }}> Control Measures </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10, marginVertical: 10, backgroundColor: Colors.white, borderRadius: 15 }}>
                        <View >
                            <Text style={styles.buttonText}>Copper oxychloride</Text>
                            <Text style={{ marginLeft: 15, fontSize: 18, padding: 0 }}>BLITOX (Rallis India)</Text>
                            <Text style={styles.buttonText}>Quantity</Text>
                            <Text style={{ marginLeft: 15, fontSize: 18, padding: 0 }}>500.0 gram Per Acre</Text>
                        </View>
                        <View style={{ textAlign: 'center', justifyContent: 'center' }}>
                            <Image source={require('../assets/noimage.png')} style={{ height: 100, width: 100 }} />
                        </View>
                    </View> */}
        </View>

        {/* <View style={styles.subContainer}>
                    <TouchableOpacity>
                        <Text style={styles.heading}>Short Description</Text>
                        <Icon type='font-awesome' color={Colors.secondary} name={'chevron-down' } />
                    </TouchableOpacity>
                </View> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 300,
  },
  subContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
    marginVertical: 10,
    // borderRadius: 15
  },
  title: {
    color: Colors.secondary,
    fontSize: 30,
    fontWeight: '800',
    marginHorizontal: 10,
  },
  heading: {
    color: Colors.secondary,
    fontSize: 25,
    fontWeight: '700',
    // height: '25%',
    backgroundColor: Colors.white,
    padding: 10,
    margin: 15,
  },
  maincontainer: {
    backgroundColor: Colors.white,
  },
  // heading: {
  // 	textAlign: 'center',
  // 	padding: 10,
  // 	fontSize: 30,
  // 	color: 'black',
  // 	fontWeight: 'bold'
  // },
  borderLine: {
    borderBottomColor: Colors.green,
    borderBottomWidth: 2,
    margin: 10,
  },
  // container: {
  // 	backgroundColor: '#fff',
  // 	justifyContent: 'center',
  // 	flexDirection: 'column',
  // 	fontSize: 18,
  // 	padding: 15,
  // },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 2,
    borderColor: '#efefef',
    // marginVertical: 10
    margin: 5,
    borderRadius: 5,
  },
  bgcolorwhite: {
    backgroundColor: 'white',
    borderRadius: 25,
  },
  bgcolorgreen: {
    // backgroundColor: '#50C878',
    borderRadius: 25,
  },
  buttonText: {
    flex: 1,
    fontSize: 22,
    fontWeight: '500',
    padding: 15,
    color: Colors.secondary,
  },
  // serialNumber: {
  // 	fontSize: 14,
  // 	fontWeight: '500',
  // 	textAlign: 'center',
  // 	backgroundColor: Colors.secondary,
  // 	borderRadius: 100,
  // 	color: Colors.white,
  // 	height: 20,
  // 	width: 20,
  // },
  descriptionContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 0,
    borderWidth: 1,
    borderColor: '#efefef',
  },
  descriptionView: {
    fontSize: 20,
    padding: 15,
    color: '#954535',
    fontWeight: '500',
  },
});
