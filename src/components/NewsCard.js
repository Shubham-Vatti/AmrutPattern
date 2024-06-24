import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import { Card } from 'react-native-elements';
import { Card } from '@rneui/themed';
import { Colors } from '../constants/Theme';

function NewsCard({ style = "", item, navigation }) {
    // console.log(item.crop_image);
    const newsNavigate = (newsId) => {
        navigation.navigate('News Description', {
            news_id: newsId
        })
    }
    return (
        <View style={{ backgroundColor: Colors.bodybackground }}>
            <TouchableOpacity style={style} activeOpacity={0.8} onPress={() => { newsNavigate(item.id) }}>
                <Card>
                    <View style={styles.titleView}>
                        <View style={styles.flexRow}>
                            <Image style={styles.titleImage} source={item.crop_image !== "" ? { uri: item.crop_image } : require('../assets/defaultCrop.png')} />
                            <Text style={styles.newsTitle}>{item.crop_name}</Text>
                        </View>
                        <Text style={styles.verticalCenter}>{item.news_date}</Text>
                    </View>
                    <View style={styles.pt8}>
                        <Image source={item.image !== "" ? { uri: item.image } : require('../assets/defaultCrop.png')} style={{ height: 150,borderRadius:10 }} />
                        <Text style={{ fontSize: 16, paddingTop: 5 }}>{item.title}</Text>
                    </View>
                </Card>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    titleView: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    flexRow: {
        flexDirection: "row"
    },
    titleImage: {
        height: 40,
        width: 40,
        borderRadius: 28
    },
    newsTitle: {
        textAlignVertical: "center",
        paddingStart: 10,
        fontSize: 16
    },
    verticalCenter: {
        textAlignVertical: "center"
    },
    pt8: {
        paddingTop: 8
    },
    shadowCss: {
        shadowColor: '#171717',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
    }
})

export default NewsCard