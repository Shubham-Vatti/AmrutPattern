import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import IntroSlid1 from '../assets/Intro1.png';
import IntroSlid2 from '../assets/Intro2.png';
import IntroSlid3 from '../assets/Intro3.png';
import IntroSlid4 from '../assets/Intro4.jpg';
import IntroSlid5 from '../assets/Intro5.jpg';
import IntroSlid6 from '../assets/Intro6.jpg';
import IntroSlid7 from '../assets/Intro7.jpg';
import IntroSlid8 from '../assets/Intro8.jpg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native';
import { Colors } from '../constants/Theme';
const {width, height} = Dimensions.get('window');

const slides = [
  {
    id: 1,
    src: IntroSlid4,
    text: 'As summer progresses, gaps will inevitably start to appear in your garden as plants',
    title: 'Farm Driving',
  },
  {
    id: 2,
    src: IntroSlid5,
    text: 'Be part of the agriculture and gives your team the power you need to do your best',
    title: 'Plant Growing',
  },
  {
    id: 3,
    src: IntroSlid6,
    text: 'Radishes are one of the fastest vegetables, taking just three to four weeks to reach harvest time.',
    title: 'Fast Harvesting',
  },
  {
    id: 4,
    src: IntroSlid7,
  },
  {
    id: 5,
    src: IntroSlid8,
  },
];
let flatList1;
const AppIntro = ({closeIntro}) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewRef = React.useRef(viewableItems => {
    setCurrentIndex(viewableItems.viewableItems[0].index);
  });
  const SkipButton = () => {
    if (flatList1 != undefined && flatList1 != null) {
        closeIntro()
    //   flatList1.scrollToOffset({animated: true, offset: width * 4});
    //   navigation.navigate('LoginScreen');
    }
  };
  const ClickedNext = () => {
    if (flatList1 != undefined && flatList1 != null) {
      flatList1.scrollToOffset({
        animated: true,
        offset: width * (currentIndex + 1),
      });
    }
  };
  const ClickedBack = () => {
    if (flatList1 != undefined && flatList1 != null) {
      flatList1.scrollToOffset({
        animated: true,
        offset: width * (currentIndex - 1),
      });
    }
  };

  const GetCurrentSlide = async () => {
    try {
      console.log('--asyncdata--', currentIndex.toString());
      await AsyncStorage.setItem('CurrentSlide', currentIndex.toString());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetCurrentSlide();
  }, [currentIndex]);

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        <FlatList
          ref={flatList => {
            flatList1 = flatList;
          }}
          pagingEnabled
          bounces={false}
          onViewableItemsChanged={onViewRef.current}
          showsHorizontalScrollIndicator={false}
          keyExtractor={key => key.id.toString()}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 25,
            minimumViewTime: 200,
          }}
          scrollEventThrottle={16}
          decelerationRate={'normal'}
          data={slides}
          horizontal
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          scrollEnabled
          renderItem={({item, index}) => {
            return <IntroSlide item={item} />;
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: width * 0.06,
            bottom: width * 0.04,
          }}>
          <TouchableOpacity onPress={() => SkipButton()}>
            <Text style={{fontWeight: '600', fontSize: 14}}>Skip</Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {slides.map((ele, i) => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const DotStyling = scrollX.interpolate({
                inputRange,
                outputRange: [4, 7, 4],
                extrapolate: 'clamp',
              });
              const bgColor = scrollX.interpolate({
                inputRange,
                outputRange: ['gray', 'black', 'gray'],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={ele.id}
                  style={[
                    {
                      width: DotStyling,
                      margin: width * 0.008,
                      height: DotStyling,
                      backgroundColor: bgColor,
                      borderRadius: 100,
                    },
                  ]}
                />
              );
            })}
          </View>
          <TouchableOpacity
            onPress={() => {
              currentIndex != 4 ? ClickedNext() :closeIntro();
            }}>
            <Text style={{fontWeight: '600', fontSize: 14}}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const IntroSlide = ({item}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'center',
      }}>
      <Image
        source={require('../assets/logo.png')}
        style={{width: '40%', height: '30%', resizeMode:'contain',alignSelf:'center',marginTop:width*0.1}}
      />
      <Text style={{color:Colors.black,fontSize:18,fontWeight:'800',textAlign:'center',paddingBottom:width*0.18}}>{'Amrut '}<Text style={{color:Colors.secondary}}>Pattern</Text></Text>
      <Image source={item.src} style={styles.sliderImage} />
      {/* <Text style={styles.sliderTitle}>{item.title}</Text>
            <Text style={styles.sliderDescription}>{item.text}</Text> */}
    </View>
  );
};

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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width * 0.6,
    resizeMode: 'cover',
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
});

export default AppIntro;
