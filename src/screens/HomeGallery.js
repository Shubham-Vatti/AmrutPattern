import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useContext } from 'react';
import Swiper from 'react-native-swiper';
import {Colors} from '../constants/Theme';
import { translator } from '../locales/I18n';
import { AuthContext } from '../../App';

const HomeGallery = ({navigation}) => {
  const { language } = useContext(AuthContext);
  const homeGalleryData = [
    {
      "image": require('../assets/HomeGallSlider/slider1.jpg')
    },
    {
      "image": require('../assets/HomeGallSlider/slider2.jpg')
    },
    {
      "image": require('../assets/HomeGallSlider/slider3.jpg')
    },
    {
      "image": require('../assets/HomeGallSlider/slider4.jpg')
    }
  ]
  return (
    <View style={{marginTop: 10}}>
      <Text style={{ fontSize: 18, paddingLeft: 20, paddingBottom:10, color: "#000", fontWeight: "600", marginTop: 10 }}>{translator("home.gallery", language)}</Text>
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
          {
            homeGalleryData.map((item,index)=>(
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('gallery')}
              key={index}
              >
              <Image
                source={item.image}
                style={{width: '100%', height: 300}}
              />
            </TouchableOpacity>
            ))
          }
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 300,
  },
});

export default HomeGallery;