import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView, useWindowDimensions, ActivityIndicator, ToastAndroid, SafeAreaView } from 'react-native'
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from 'react-native-config';
import { AuthContext } from '../../App';
import { Colors } from '../constants/Theme';
import RenderHTML from 'react-native-render-html';

const AboutEnglish = () => {
    return (
        <View style={{ padding: 15 }}>
            {/* <Text>Preface</Text> */}
            <Text>
                What is the first Amrut  Pattern?
            </Text>
            <Text>
                Farmer Friend Amrut Pattern Method is one of the most revolutionary and highly productive methods in the field of agriculture.
            </Text>
            <View style={{ marginBottom: 10 }}>
                <Text>
                    1) Cotton grown from 22 quintals to 51 quintals per acre.
                </Text>
                <Text>
                    2) Soybean grown from 10 quintals to 22 quintals per acre.
                </Text>
                <Text>
                    3) Tuar yielded from 12 to 22 quintals per acre.
                </Text>
                <Text>
                    4) Chana Yield from 15 to 24 quintals per acre.
                </Text>
                <Text>
                    5) Summer groundnut yielded from 15 to 32 quintals per acre.
                </Text>
            </View>
            <View style={{ marginBottom: 15 }}>
                <Text>
                    In many of these crops, they experimented with new products to maximize yields, e.g.
                </Text>
                <Text>
                    1) What should be the direction of cultivation and sowing?
                </Text>
                <Text>
                    2) What should be the distance between the two trees?
                </Text>
                <Text>
                    3) The maximum number of trees in which distance method fits.
                </Text>
                <Text>
                    4) It is important for each plant to have maximum exposure to sunlight and air.
                </Text>
                <Text>
                    5) The whole planning of manure is different from the traditional method
                </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <Text>
                    Farmer  friends, the Amrut pattern method is used for farming in five to seven states and this method is benefiting more and more farmers. Many farmers have taken record production in this method at very low cost. The most important reason for the highest yield is the manure process. The distance planning is also very different.
                </Text>
            </View>
            <Text>
                Method
            </Text>
            <View>
                <Text style={styles.method}>
                    The cost per acre in this method is much less than the conventional method.
                </Text>
                <Text style={styles.method}>
                    In this method, it is not recommended to use any kind of top manure, tonic, steamy, soluble manure.
                </Text>
                <Text style={styles.method}>
                    If you plan this way from start to finish, you will definitely get a record product.
                </Text>
                <Text style={styles.method}>
                    The Amrut pattern has been created with the view that every farmer should take advantage of the maximum production at low cost with the nectar pattern method.
                </Text>
                <Text style={styles.method}>
                    Farmer friends, we request you to leave the traditional method and take the produce of each crop in the Amrut pattern method. This is the request / expectation.
                </Text>
            </View>
            <View style={styles.method}>
                <Text>Thank you.</Text>
                <Text>Amrut Rao Deshmukh</Text>
            </View>
        </View>
    )
}

const AboutHindi = () => {
    return (
        <View style={{ padding: 15 }}>
            {/* <Text>प्रस्तावना।</Text> */}
            <Text>
                पहला अमृत पैटर्न क्या है?
            </Text>
            <Text>
                किसान भाईओ अमृत पैटर्न विधि कृषि के क्षेत्र में सबसे क्रांतिकारी और अत्यधिक उत्पादक विधियों में से एक है।
            </Text>
            <View style={{ marginBottom: 10 }}>
                <Text>
                    1) कपास 22 क्विंटल से बढ़कर 51 क्विंटल प्रति एकड़ हो गई है।
                </Text>
                <Text>
                    2) सोयाबीन 10 क्विंटल से बढ़कर 22 क्विंटल प्रति एकड़।
                </Text>
                <Text>
                    3) तुवर की पैदावार 12 से 22 क्विंटल प्रति एकड़।
                </Text>
                <Text>
                    4) चने की उपज 15 से 24 क्विंटल प्रति एकड़।
                </Text>
                <Text>
                    5) ग्रीष्मकालीन मूंगफली की पैदावार 15 से 32 क्विंटल प्रति एकड़।
                </Text>
            </View>
            <View style={{ marginBottom: 15 }}>
                <Text>
                    इनमें से कई फसलों में, उन्होंने पैदावार बढ़ाने के लिए नए उत्पादों के साथ प्रयोग किया, उदा।
                </Text>
                <Text>
                    1) खेती और बुवाई की दिशा क्या होनी चाहिए?
                </Text>
                <Text>
                    2) दोनों पेड़ों के बीच की दूरी कितनी होनी चाहिए?
                </Text>
                <Text>
                    3) पेड़ों की अधिकतम संख्या जिसमें दूरी विधि फिट बैठती है।
                </Text>
                <Text>
                    4) प्रत्येक पौधे के लिए सूर्य के प्रकाश और हवा के अधिकतम संपर्क में होना महत्वपूर्ण है।
                </Text>
                <Text>
                    5) खाद की पूरी योजना पारंपरिक पद्धति से अलग है।
                </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <Text>
                    किसान मित्रों, पांच से सात राज्यों में खेती के लिए अमृत पैटर्न विधि का उपयोग किया जाता है और इस विधि से अधिक से अधिक किसानों को लाभ हो रहा है। कई किसानों ने इस विधि से बहुत कम लागत पर रिकॉर्ड उत्पादन लिया है। उच्चतम उपज का मुख्य कारण पहला है खाद बनाने की प्रक्रिया दूरी योजना भी बहुत अलग है।
                </Text>
            </View>
            <Text>
                विधि
            </Text>
            <View>
                <Text style={styles.method}>
                    इस विधि में प्रति एकड़ लागत पारंपरिक विधि की तुलना में काफी कम है।
                </Text>
                <Text style={styles.method}>
                    इस विधि में किसी भी प्रकार का कोई भी कंपनी का महेंगा खाद, टॉनिक , किटनाशक का प्रयोग करणे की शिफारस अमृत पॅटर्न नही करता।
                </Text>
                <Text style={styles.method}>
                    यदि आप शुरू से अंत तक इस तरह से योजना बनाते हैं, तो आपको निश्चित रूप से एक रिकॉर्ड उत्पाद मिलेगा।
                </Text>
                <Text style={styles.method}>
                    अमृत पैटर्न इस दृष्टि से बनाया गया है कि प्रत्येक किसान को कम लागत पर अधिकतम उत्पादन का लाभ अमृत पैटर्न पद्धति से लेना चाहिए।
                </Text>
                <Text style={styles.method}>
                    किसान मित्रों, हम आपसे अनुरोध करते हैं कि पारंपरिक पद्धति को छोड़ कर प्रत्येक फसल की उपज को अमृत पैटर्न विधि में लें। यही अनुरोध/अपेक्षा है।
                </Text>
            </View>
            <View style={styles.method}>
                <Text>।धन्यवाद।</Text>
                <Text>अमृतराव देशमुख</Text>
            </View>
        </View>
    )
}

const AboutMarathi = () => {
    return (
        <View style={{ padding: 15 }}>
            {/* <Text>प्रस्तावना।</Text> */}
            <Text>
                सर्वात प्रथम अमृत पॅटर्न म्हणजे काय.?
            </Text>
            <Text>
                शेतकरी मित्रानो अमृत पॅटर्न पद्धत ही शेती क्षेत्रात नवीन क्रांती करणारी व तसेच सर्वाधिक उत्पादन देणारी पद्धत आहे या पद्धतीचा उगम यवतमाळ जिल्ह्यात अंबोडा या गावांमधून श्री अमृत रावजी दादा रोजी देशमुख यांच्याकडून झाला यांनी स्वतःच्या शेतामध्ये वेग वेगळे प्रयोग करून प्रत्येक पिकामध्ये विक्रमी उत्पादन घेतले जसे की
            </Text>
            <View style={{ marginBottom: 10 }}>
                <Text>
                    1) कापूस एकरी 22 क्विंटल पासून 51 क्विंटलपर्यंत घेतले घेतले.
                </Text>
                <Text>
                    2) सोयाबीन एकरी 10 क्विंटल पासून 22 क्विंटल पर्यंत
                </Text>
                <Text>
                    3) तूर एकरी 12 पासून ते 22 क्विंटल एवढे उत्पादन घेतले
                </Text>
                <Text>
                    4) हरभरा एकरी 15 पासून ते 24 क्विंटलपर्यंत उत्पादन घेतले
                </Text>
                <Text>
                    5) उन्हाळी भुईमूग एकरी 15 पासून ते 32 क्विंटल पर्यंत उत्पादन घेतले
                </Text>
            </View>
            <View style={{ marginBottom: 15 }}>
                <Text>
                    अशा अनेक पिकांमध्ये त्यांनी खूप सारे नवीन प्रयोग करून जास्तीत जास्त उत्पादन घेतले उदा.
                </Text>
                <Text>
                    1) लागवडीची व पेरण्याची दिशा कोणती असायला हवी
                </Text>
                <Text>
                    2) दोन्ही तासातील अंतर दोन्ही झाडातील अंतर किती असायला हवे?
                </Text>
                <Text>
                    3) जास्तीत जास्त झाडाची संख्या कोणत्या अंतर पद्धतीमध्ये बसते
                </Text>
                <Text>
                    4) प्रत्येक झाडाला सूर्यप्रकाश व हवा मोकळी असणे महत्त्वाचे यावर जास्तीत जास्त भर।
                </Text>
                <Text>
                    5) खताचे संपूर्ण नियोजन पारंपारिक पद्धतीपेक्षा वेगळे।
                </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <Text>
                    शेतकरी मित्रांनो अमृत पॅटर्न पद्धतीने पाच ते सात राज्यांमध्ये शेती केल्या जाते आणि या पद्धतीचा फायदा जास्तीत जास्त शेतकऱ्यांना होत आहे अनेक शेतकऱ्यांनी या पद्धतीने विक्रमी उत्पादन खूपच कमी खर्चा मध्ये घेतलेले आहे या पद्धतीमध्ये कुठल्याही प्रकारच्या महाग औषधाची stimulnt ची वर खताची टॉनिक ची शिफारस केली जात नाहीत यामध्ये सर्वाधिक उत्पादन येण्याचे महत्त्वाचे कारण सर्वात प्रथम शेणखत प्रक्रिया ही आहे अंतरा चे नियोजन सुद्धा खूप वेगळ्या पद्धतीचे आपल्याला अमृत पॅटर्न पद्धतीमध्ये बघायला मिळेल।
                </Text>
            </View>
            <Text>
                दृष्टिकोन_
            </Text>
            <View>
                <Text style={styles.method}>
                या पद्धतीमध्ये पारंपरिक पद्धतीपेक्षा एकरी लागणारा खर्च खूपच कमी प्रमाणात येतो.
                </Text>
                <Text style={styles.method}>
                या पद्धतीमध्ये कुठल्या प्रकारचे वर खत, टॉनिक, स्तीमुलंत, विद्राव्य खत ,वापरण्याची शिफारस केलेली नाही..
                </Text>
                <Text style={styles.method}>
                आपण या पद्धतीने जर सुरुवातीपासून शेवटपर्यंत संपूर्ण नियोजन केले तर, नक्कीच आपल्याला विक्रमी उत्पादन मिळू शकते..
                </Text>
                <Text style={styles.method}>
                प्रत्येक शेतकऱ्याने अमृत पॅटर्न पद्धतीने कमी खर्चात जास्तीत जास्त उत्पादन याचा लाभ घ्यावा या दृष्टिकोनातून अमृत पॅटर्न ची निर्मिती केलेली आहे..
                </Text>
                <Text style={styles.method}>
                शेतकरी मित्रांनो आपल्याला विनंती आहे की पारंपारिक पद्धत सोडून आपण प्रत्येक पिकाचे उत्पादन अमृत पॅटर्न पद्धतीने घ्यावे हीच विनंती 
                </Text>
            </View>
            <View style={styles.method}>
                <Text>अपेक्षा धन्यवाद..</Text>
                <Text>अमृतराव देशमुख 🙏</Text>
            </View>
        </View>
    )
}

const AboutUs = () => {

    const [aboutData, setAboutData] = useState({});
    const { signOut, language, isNetworkAvailable ,AppVersion} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const { width } = useWindowDimensions();
    useEffect(() => {
        console.log('--aboutus-appversion--',AppVersion)
        const getToken = async () => {
            let checkToken = await AsyncStorageLib.getItem("amrut_session");
            if (checkToken == null) {
                signOut();
                return;
            }
            const getApiUrl = `${Config.API_BASE_URL}/page-content?language=${language}&version=${AppVersion}`;
            axios.get(getApiUrl, { headers: { 'Authorization': checkToken } })
                .then((res) => {
                    if (res.data.success == true) {
                        setAboutData(res.data.response);
                    } else {
                        setAboutData({});
                        ToastAndroid.show("Somthing went Wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
                    }
                    setLoading(true);
                }).catch(function (error) {
                    // handle error
                    // alert(error.message);
                    ToastAndroid.show("Somthing went Wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
                })
        }
        getToken();
    }, [isNetworkAvailable]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodybackground }}>
            {
                loading ?
                    <>
                        <ScrollView>
                            <View style={styles.container}>
                                <Image style={styles.logoimage} source={require('../assets/logo.png')} />
                            </View>
                            {
                                (language == "en") ?
                                    <View>
                                        <AboutEnglish />
                                    </View>
                                    :
                                    (language == "hi") ?
                                        <View>
                                            <AboutHindi />
                                        </View>
                                        :
                                        (language == "mr") ?
                                            <View>
                                                <AboutMarathi />
                                            </View>
                                            :
                                            <></>
                            }
                        </ScrollView>
                    </>
                    :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" />
                    </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        width: '100%',
        justifyContent: 'center',
        backgroundColor: '#e8e8e8',
        // opacity: .4
    },
    logoimage: {
        height: 150,
        width: 120,
        alignSelf: 'center'
    },
    method: {
        marginVertical: 5
    }
})
export default AboutUs;