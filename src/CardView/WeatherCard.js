// import React from 'react';
// import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
// import { Text, Card, } from 'react-native-elements';
// import { Row, Col } from 'react-native-responsive-grid-system';

// const cardDetails = [
//   {
//     title: "Sugar Cane",
//     imgUrl: require('../assets/CardImage/Sugarcane.jpg'),
//     description: "Sugarcane crop thrives best in hot sunny tropical areas. The ideal climate for sugarcane is a long, warm growing season . ",
//   },
//   {
//     title: "Rice",
//     imgUrl: require('../assets/CardImage/Rice.jpg'),
//     description: "Kharif or winter is the main rice growing season in the country. It is known as Winter or Kharif Rice as per harvesting time.",
//   },
//   {
//     title: "Wheat",
//     imgUrl: require('../assets/CardImage/wheat.jpg'),
//     description: "Wheat plants can be grown and planted in a wide range of agro-climatic conditions. ... The most suitable climate for wheat farming is moist and cool weather.",
//   },
//   {
//     title: "Cotton",
//     imgUrl: require('../assets/CardImage/cotton.jpg'),
//     description: "Wheat plants can be grown and planted in a wide range of agro-climatic conditions. ... The most suitable climate for wheat farming is moist and cool weather.",
//   },
// ];
// const SingleCard = ({ item }) => {
//   return (
//     <>
//       <View>
//         <Card containerStyle={{ margin: 5, marginBottom: 10 }}>
//           <Card.Title>{item.title}</Card.Title>
//           <Card.Image source={item.imgUrl} />
//           <Text style={styles.paragraph}>{item.description}</Text>
//         </Card>
//       </View>
//     </>
//   );
// };



// const CardRow = (props) => {
//   console.log(props)
//   const {navigation} = props;
//   const imageClicked = () => {
//       // alert('hello');
//       navigation.navigate('About Crop')
//   }
//   return (
//     <View>
//       <Row>
//         {cardDetails.map((item, index) => (
//           <Col xs={6} key={index}>
//             <TouchableOpacity onPress={imageClicked}>
//               <SingleCard item={item} />
//             </TouchableOpacity>
//           </Col>
//         ))}
//       </Row>
//     </View>
//   );
// };

// const Cards = ({navigation}) => {
//   return (
//     <ScrollView>
//       <CardRow navigation= {navigation} />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   paragraph: {
//     marginTop: 10,
//     textAlign: 'center',
//   }
// })

// export default Cards;