import { Dimensions, FlatList, Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import AsyncStorageLib from '@react-native-async-storage/async-storage'
import { AuthContext } from '../../App';
import Config from 'react-native-config';
import { ActivityIndicator } from 'react-native';
const {width, height} =Dimensions.get('window')

const CropProtectionList = ({route,navigation}) => {
    const {crop_id}=route.params;
    const [loading, setLoading] = useState(false);
    const [protectionData, setProtectionData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const {signOut, language, isNetworkAvailable,AppVersion} = useContext(AuthContext);
    useEffect(()=>{
        getCropdata()
    },[crop_id])
    
    const getCropdata=async()=>{
        try{
            let checkToken = await AsyncStorageLib.getItem('amrut_session');
            if (checkToken == null) {
              signOut();
              return;
            }
        
            const getProtectionApiUrl = `https://amrutpattern.com/api/crop-protection/list/${crop_id}?version=${AppVersion}`;
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
        }
        catch(err)
        {
            console.log(err)
        }
    }
  return (
    <View style={{flex: 1}}>
      {loading ? (
		<View style={{flex:1,alignItems:'center',marginTop:width*0.08}}>
		<FlatList
		showsVerticalScrollIndicator={false}
    // ListEmptyComponent={}
    ListEmptyComponent={({})=>{
      return (
        <View>
          <Text style={{color:'gray',fontSize:18,fontWeight:'600'}}>No crop list</Text>
        </View>
      )
    }}
		data={protectionData}
		numColumns={2}
		renderItem={({item,index})=>{
			return(
				<TouchableOpacity style={{marginHorizontal:width*0.02,elevation:2,marginVertical:width*0.01,backgroundColor:'white',padding:width*0.04,marginTop:width*0.034}}
        onPress={()=>{navigation.navigate('Crops Protection Details',{
          protection_id:item.id
        })}}
				>
					<Image source={{uri:Config.BASE_URL+item.thumbnail}}
					style={{width:width*0.36,height:width*0.36,resizeMode:'cover'}}
					/>
					<Text style={{color:'black',width:width*0.36,marginTop:width*0.04,textAlign:'center',fontWeight:'600'}}>{item.title}</Text>
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
  )
}

export default CropProtectionList

const styles = StyleSheet.create({})