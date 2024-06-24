import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Button } from "react-native";
// import Carousel, { Pagination } from 'react-native-snap-carousel';
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem';
import Config from 'react-native-config';

// const SliderImage = [
//   {
//     imgUrl: `${Config.BASE_URL}/backend_assets/images/cropsProtection/crop_image_8202.jpg`,
//   },
//   {
//     imgUrl: require('../assets/SliderImage/farm.jpg'),
//   },
//   {
//     imgUrl: require('../assets/SliderImage/farming.jpg'),
//   },
// ];

const CarouselCards = ({ itemImg = null }) => {
  const [index, setIndex] = React.useState(0)
  const isCarousel = React.useRef(null);
  const [sliderImages, setSliederImages] = useState([]);


  useFocusEffect(
    useCallback(() => {
      if (itemImg) {
        let images = itemImg.split(",");
        let sliderImage = [];
        console.log(itemImg);
        for (let index = 0; index < images.length; index++) {
          sliderImage.push({ imgUrl: `${Config.BASE_URL}${images[index]}` });
        }
        console.log(sliderImage)
        setSliederImages([...sliderImage]);
      }
    }, [])
  );

  useEffect(() => {
    // alert(sliderImages.length);
    console.log(sliderImages)
  }, [sliderImages])

  return (
    <View style={styles.container}>
      {
        sliderImages.length > 0 &&<></>
        // <>
        //   <Carousel
        //     layout="tinder"
        //     layoutCardOffset={1}
        //     ref={isCarousel}
        //     data={sliderImages}
        //     renderItem={CarouselCardItem}
        //     sliderWidth={SLIDER_WIDTH}
        //     itemWidth={ITEM_WIDTH}
        //     onSnapToItem={(index) => setIndex(index)}
        //     useScrollView={true}
        //     autoplay={true}
        //   // loop={true}
        //   />
        //   <Pagination
        //     dotsLength={sliderImages.length}
        //     activeDotIndex={index}
        //     carouselRef={isCarousel}
        //     dotStyle={{
        //       width: 10,
        //       height: 10,
        //       borderRadius: 5,
        //       marginHorizontal: 0,
        //       backgroundColor: '#000000'
        //     }}
        //     inactiveDotOpacity={0.4}
        //     inactiveDotScale={0.6}
        //     tappableDots={true}
        //   />
        // </>
      }
      {/* <Button title="Click" onPress={()=>{alert(process.env.NODE_ENV)}}/> */}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 10,
  },
});

export default CarouselCards;