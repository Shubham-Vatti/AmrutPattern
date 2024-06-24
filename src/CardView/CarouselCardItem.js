import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
export const SLIDER_WIDTH = Dimensions.get('window').width ;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH );

const CarouselCardItem = ({ item, index }) => {
  console.log("item", item)
  return (
    <View style={styles.container} key={index}>
      <Image
        source={{ uri:item.imgUrl }}
        style={styles.image}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: ITEM_WIDTH,
  },
  image: {
    width: ITEM_WIDTH,
    height: 300,
  },
  header: {
    color: "#222",
    fontSize: 28,
    fontWeight: "bold",
    // paddingLeft: 20,
    // paddingTop: 20
  },
  body: {
    color: "#222",
    fontSize: 18,
    // paddingLeft: 20,
    // paddingLeft: 20,
    // paddingRight: 20
  }
})

export default CarouselCardItem;