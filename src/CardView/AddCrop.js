import React, { useState, useEffect, useContext } from 'react';
import { Text,View, ScrollView, StyleSheet, Button, Alert, TouchableOpacity, Image, ToastAndroid, ActivityIndicator, FlatList } from 'react-native';
// import { , Card, } from 'react-native-elements';
import { Row, Col } from 'react-native-responsive-grid-system';
// import { SearchBar } from 'react-native-elements';
import { SearchBar } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/FontAwesome5';
import { Colors } from '../constants/Theme';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../../App';
import Config from 'react-native-config';
import { translator } from '../locales/I18n'
import Feather from 'react-native-vector-icons/Feather'

const AddCropDetail = (props) => {
  const { item, selectedCrops } = props;
  return (
    <>
      <View style={{ alignItems: "center", paddingTop: 20 }}>
        <View style={{}}>
          <Image source={(item.image == null) ? require('../assets/defaultCrop.png') : { uri: item.image }} style={(selectedCrops.includes(item.id)) ? styles.image1 : styles.image} />
          {(selectedCrops.includes(item.id)) ? <Ionicons name='check' size={40} style={styles.icon} /> : null}
        </View>
        <Text style={styles.paragraph}>{item.title}</Text>
      </View>
    </>
  );
};


function AddCrop({ navigation }) {

  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [cropsData, setcropsData] = useState([]);
  const [loading, setloading] = useState(false)
    // const { signOut, language, isNetworkAvailable ,} = useContext(AuthContext);
    const { signOut, language, isNetworkAvailable ,AppVersion} = useContext(AuthContext)
  const [search, setSearch] = useState("");

  const [token, setToken] = useState();
  useEffect(() => {
    const getToken = async () => {
      let checkToken = await AsyncStorageLib.getItem("amrut_session");
      setToken(checkToken);
      if (checkToken == null) {
        signOut();
        return;
      }
      const getApiUrl = `${Config.API_BASE_URL}/customer-crops?language=${language}&version=${AppVersion}`
      axios.get(getApiUrl, { headers: { 'Authorization': checkToken } })
        .then((res) => {
          if (res.data.success == true) {
            setFilteredDataSource([...res.data.response]);
            setcropsData([...res.data.response]);
          } else {
            setcropsData([]);
            // ToastAndroid.show("Something went wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
          }
          setloading(true);
        }).catch((error) => {
          // handle error
          // alert(error.message);
        })

    }
    getToken();
  }, [isNetworkAvailable]);

  const addDetails = () => {
    console.log('--aappii-calledd--')
    const postApiUrl = `${Config.API_BASE_URL}/customer-crops?language=${language}&version=${AppVersion}`;
    axios.post(postApiUrl, { "crop_list": selectedCrops }, { headers: { 'Authorization': token } })
      .then((res) => {
        if (res.data.success == true) {
          ToastAndroid.show(res.data.response, ToastAndroid.LONG, ToastAndroid.TOP, 25, 500);
          navigation.goBack()
        } else {
          // ToastAndroid .show("Something went wrong", ToastAndroid.LONG, ToastAndroid.CENTER);
        }
        // console.log(res.data);
      }).catch(function (error) {
        // handle error
        // alert(error.message);

      })
  }

  const [selectedCrops, setSelectedCrops] = useState([]);
  const imageClicked = (name) => {
    if (selectedCrops.includes(name)) {
      let index = selectedCrops.indexOf(name);
      selectedCrops.splice(index, 1);
    } else {
      selectedCrops.push(name);
    }
    console.log(selectedCrops);
    setSelectedCrops([...selectedCrops]);
  }

  // console.log(search);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = cropsData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(cropsData);
      setSearch(text);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {
        loading ?
          <>
            <SearchBar
              round
              searchIcon={<Feather name="search" size={24} color="black" />}
              onChangeText={(text) => searchFilterFunction(text)}
              placeholder={translator("add_crop.search", language)}
              value={search}
              // style={{borderColor: 'red'}}
              platform="ios"
            />
            <FlatList
              data={filteredDataSource}
              numColumns={3}
              renderItem={({ item, index }) => (
                <View
                  style={{ width: "33%", alignItems: "center", marginBottom: 15, marginTop: index > 2 ? 0 : 15 }}
                  key={index}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => imageClicked(item.id)}
                    style={styles.touchable}
                  >
                    <Image source={(item.image == null) ? require('../assets/defaultCrop.png') : { uri: item.image }} style={(selectedCrops.includes(item.id)) ? styles.image1 : styles.image} />
                    {(selectedCrops.includes(item.id)) ? <Ionicons name='check' size={40} style={styles.icon} /> : null}
                  </TouchableOpacity>
                  <Text style={styles.title} onPress={() => imageClicked(item.id)}>{item.title}</Text>
                </View>
              )}
            />
            <View pointerEvents={selectedCrops.length > 0 ? "auto" : "none"}>
              <TouchableOpacity activeOpacity={2} style={selectedCrops.length > 0 ? styles.button : styles.desabledbtn} onPress={()=>{addDetails()}}  >
                <Text style={styles.buttontext}
                >
                  {translator("add_crop.add", language)}
                </Text>
              </TouchableOpacity>
            </View>
          </>
          :
          <View style={{ marginTop: '50%' }}><ActivityIndicator size="large" /></View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    marginTop: 5,
    padding: 0,
    textAlign: 'center',
    fontWeight: '800',
    fontSize: 16,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 100,
    // backgroudColor: "#fff"
  },
  image1: {
    width: 90,
    height: 90,
    opacity: 0.7,
    borderRadius: 100,
  },
  button: {
    backgroundColor: Colors.secondary,
    padding: 10,
    justifyContent: 'center',
    borderRadius: 10,
    // marginTop: 8,
    marginHorizontal: 15,
    marginVertical: 15,
    // pointerEvents: 'none'
  },
  desabledbtn: {
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 10,
    justifyContent: 'center',
    borderRadius: 10,
    // marginTop: 8,
    marginHorizontal: 15,
    marginVertical: 15,
    pointerEvents: 'none'
  },
  buttontext: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',

  },
  icon: {
    position: 'absolute',
    justifyContent: 'center',
    alignSelf: 'center',
    top: 25,
    color: "#fff"
  },
  touchable: {
    height: 90,
    width: 90,
    borderRadius: 50,
    alignItems: "center",
  },

})

export default AddCrop;