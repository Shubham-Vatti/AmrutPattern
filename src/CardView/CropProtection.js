import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Dimensions,
} from 'react-native';
// import { , Card, } from 'react-native-elements';
import {Card} from '@rneui/themed';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Row, Col} from 'react-native-responsive-grid-system';
import {CropData} from './CropDetails';
import Config from 'react-native-config';
import {AuthContext} from '../../App';
import { Image } from 'react-native';
const {width, height} =Dimensions.get('window')
// import { SearchBar } from 'react-native-elements';

const AddCropDetail = ({item}) => {
  return (
    <View>
      <Card containerStyle={{margin: 5, marginBottom: 10}}>
        <Card.Image
          source={{uri: `${Config.BASE_URL}${item.thumbnail}`}}
          style={styles.image}
        />
        <Text style={styles.paragraph}>{item.title}</Text>
      </Card>
    </View>
  );
};

const CropProtection = ({route, navigation}) => {
  const crop_id = useContext(CropData);
  // console.log("crop id ", crop_id);

  const [loading, setLoading] = useState(false);
  const [protectionData, setProtectionData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const {signOut, language, isNetworkAvailable} = useContext(AuthContext);

  const imageClicked = item => {
    // alert(item);
    navigation.navigate('Crops Protection Details', {
      protection_id: item,
    });
  };

  const getToken = async () => {
    let checkToken = await AsyncStorageLib.getItem('amrut_session');
    if (checkToken == null) {
      signOut();
      return;
    }

    const getProtectionApiUrl = `https://amrutpattern.com/api/customer-subscribed-crops-list`;
    axios
      .get(getProtectionApiUrl, {headers: {Authorization: checkToken}})
      .then(res => {
        if (res.data.status == 200) {
          console.log('--crop-list-data--', res.data);
          let data = res.data.response;
          setProtectionData(data);
        } else if (res.data.status == 400) {
          console.log('--crop-list-data--', res.data);
          setProtectionData([]);
          // setProtectionData([]);
        } else {
          console.log('--crop-list-data--', res);
          ToastAndroid.show(
            'Something went wrong',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
          );
        }
        setLoading(true);
      })
      .catch(e => {
        console.log(e);
        ToastAndroid.show(
          'Something went wrong',
          ToastAndroid.LONG,
          ToastAndroid.CENTER,
        );
      });
  };

  useEffect(() => {
    getToken();
  }, [crop_id, refreshing, isNetworkAvailable]);
//   console.log(protectionData);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => {
      setRefreshing(false);
      ToastAndroid.show('Refreshed', ToastAndroid.LONG, ToastAndroid.TOP);
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      {loading ? (
		<View style={{flex:1,alignItems:'center',marginTop:width*0.08}}>
		<FlatList
		showsVerticalScrollIndicator={false}
		data={protectionData}
		numColumns={2}
    ListEmptyComponent={({})=>{
      return (
        <View>
          <Text style={{color:'gray',fontSize:18,fontWeight:'600'}}>No crop list</Text>
        </View>
      )
    }}
		renderItem={({item,index})=>{
			return(
				// console.log(item)
				<TouchableOpacity style={{marginHorizontal:width*0.02,elevation:2,marginVertical:width*0.02,backgroundColor:'white',padding:width*0.04,marginTop:width*0.034}}
				onPress={()=>navigation.navigate('CropsProtectionList',{
					crop_id:item.crop_id
				})}
				>
					<Image source={{uri:item.image}}
					style={{width:width*0.36,height:width*0.36,resizeMode:'cover'}}
					/>
					<Text style={{color:'black',width:width*0.36,marginTop:width*0.04}}>{item.title}</Text>
				</TouchableOpacity>
			)
		}}
		/>
		</View>
        // <ScrollView
        //   refreshControl={
        //     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        //   }>
        //   <Row>
        //     {protectionData.length ? (
        //       // protectionData.images &&
        //       protectionData.map((item, index) => (
        //         <Col xs={6} key={index}>
        //           <TouchableOpacity onPress={() => imageClicked(item.id)}>
        //             <AddCropDetail item={item} status="false" index={index} />
        //           </TouchableOpacity>
        //         </Col>
        //       ))
        //     ) : (
        //       <View
        //         style={{
        //           flex: 1,
        //           alignItems: 'center',
        //           justifyContent: 'center',
        //         }}>
        //         <Text style={styles.message}> No protection available</Text>
        //       </View>
        //     )}
        //   </Row>
        // </ScrollView>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {/* <View style={styles.bottomView}>
        <Button
          style={styles.buttonStyle}
          title="Add Crop"
          color="#006600"
          onPress={() => Alert.alert('Hello')}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    marginTop: 5,
    padding: 0,
    textAlign: 'center',
    // justifyContent:'center',
    // alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 150,
    height: 150,
  },
  bottomView: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    marginTop: 520,
  },
  buttonStyle: {
    fontSize: 24,
    width: '100%',
  },
  message: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000',
    marginTop: '40%',
  },
});

export default CropProtection;
