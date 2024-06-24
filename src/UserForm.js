import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text, View, ScrollView, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ToastAndroid, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import DropDown, { DropDown2 } from "./components/DropDown";
import { CommonInput } from './components/CommonInput'
// import { CheckBox } from "react-native-elements/dist/checkbox/CheckBox";
// import CheckBox from 'react-native-checkbox';
// import CheckBox from '@react-native-community/checkbox';
import { CheckBox } from "@rneui/themed";
import { Colors } from "./constants/Theme";
import axios from "axios";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { AuthContext } from "../App";
import Config from "react-native-config";
import ContentLoader, { FacebookLoader, InstagramLoader, Bullets } from "react-native-easy-content-loader";
import { useFocusEffect } from "@react-navigation/native";
import { translator } from "./locales/I18n";


export default function UserForm({ navigation }) {
	const { control, handleSubmit, formState: { errors }, setValue } = useForm({

		// defaultValues: {
		//   firstName: '',
		//   mobile: '',
		//   states: '1',
		//   dist: '',
		//   taluka: '',
		//   village: '',
		//   language: '',
		//   userAgree: '',
		// }
	});

	// function checkBoxChanged() {
	//   alert('changed');
	//   this.setState({isSelected : !this.state.isSelected})
	// }
	// const [toggleCheckBox, setToggleCheckBox] = useState(false)

	// const onSubmit = data => console.log(data);
	const [selectedState, setSelectedState] = useState("");
	const [customerdetails, setCustomerDetails] = useState([]);
	const { signOut, updateDetail, updateLang, language, isNetworkAvailable } = useContext(AuthContext);
	const [stateList, setStateList] = useState([]);
	const [token, setToken] = useState();
	const [customerData, setCustomerData] = useState("");
	const [loading, setLoading] = useState(false);

	useFocusEffect(
		useCallback(() => {
			const getToken = async () => {
				console.log("language :- ", language);
				let checkToken = await AsyncStorageLib.getItem("amrut_session");
				setToken(checkToken)
				if (checkToken == null) {
					signOut();
				}

				const getCustomerDetailsApiUrl = `${Config.API_BASE_URL}/customer-details`;
				axios
					.get(getCustomerDetailsApiUrl, { headers: { 'Authorization': checkToken } })
					.then((res) => {
						console.log("Response is :- ", res.data)
						if (res.data.success == true) {
							setCustomerData(...res.data.response);
							console.log("check data", res.data.response)
							setValue("firstName", res.data.response[0].name);
							setValue("mobile", res.data.response[0].mobile);
							setValue("language", res.data.response[0].language);
							setValue("states", res.data.response[0].state_id);
							setValue("dist", res.data.response[0].district);
							setValue("taluka", res.data.response[0].taluka);
							setValue("village", res.data.response[0].village);
							setValue("userAgree", true);
							setSelectedState(res.data.response[0].state_name);
							try {
								setCustomerDetails(data[0]);
							} catch {
								setCustomerDetails([]);
							}
						} else {
							ToastAndroid.show("Somthing went wrong", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
						}
						setLoading(true);
					})
					.catch((e) => {
						ToastAndroid.show("Somthing went wrong", ToastAndroid.SHORT, ToastAndroid.BOTTOM);
					})

				const getStateListApiUrl = `${Config.API_BASE_URL}/state-list`;
				axios
					.get(getStateListApiUrl, { headers: { 'Authorization': checkToken } })
					.then((res) => {
						if (res.data.success == true) {
							setStateList([...res.data.response]);
						}
					})
			}
			getToken();
		}, [isNetworkAvailable])
	)

	const onSubmit = (data) => {
		console.log("token", token);
		const postAccountDetailsApiUrl = `${Config.API_BASE_URL}/customer/account-details`;
		axios
			.post(postAccountDetailsApiUrl, { "name": data.firstName, "state": data.states, "district": data.dist, "taluka": data.taluka, "village": data.village }, { headers: { 'Authorization': token } })
			.then((res) => {
				if (res.data.success == true) {
					customerdetails.name = data.firstName;
					customerdetails.mobile = data.mobile;
					customerdetails.state = data.states;
					customerdetails.district = data.dist;
					customerdetails.taluka = data.taluka;
					customerdetails.village = data.village;
					updateDetail(customerdetails);
					ToastAndroid.show("Profile Updated Successfully", ToastAndroid.LONG, ToastAndroid.CENTER);
					navigation.navigate('Home')
				} else {
					ToastAndroid.show("Somthing went Wrong", ToastAndroid.SHORT, ToastAndroid.CENTER)
				}
			})
			.catch((e) => {
				ToastAndroid.show("Somthing went Wrong", ToastAndroid.SHORT, ToastAndroid.CENTER)
			})
	}

	const languageChanged = (e) => {
		updateLang(e);
	}


	return (
		<>
			{
				loading ?
					<ScrollView style={styles.container}>
						<CommonInput
							control={control}
							name="firstName"
							editable={true}
							rules={{
								minLength: {
									value: 2,
									message: "Enter Atleast 2 Charecter"
								},
								required: "Name is required",
							}}
							placeholder={ translator("account.name", language) }
							error={errors.firstName ? errors.firstName.message : null}
						/>

						<CommonInput
							control={control}
							name="mobile"
							editable={false}
							keyboardType="numeric"
							rules={{
								required: "Mobile is required.",
								pattern: {
									value: /^[6789]\d{9}$/,
									message: "Please enter a valid mobile number"
								}
							}}
							placeholder="Enter mobile number"
							error={errors.mobile ? errors.mobile.message : null}
						/>

						<DropDown2
							name="language"
							value={language}
							dropdown={[{ "id": "en", "name": "English" }, { "id": "hi", "name": "Hindi" }, { "id": "mr", "name": "Marathi" }]}
							onChange={languageChanged}
						/>
						<DropDown name="states" selectedState={selectedState} control={control} dropdown={stateList} />


						<CommonInput
							control={control}
							name="dist"
							editable={true}
							rules={{
								required: "District is required."
							}}
							placeholder={translator("account.district", language)}
							error={errors.dist ? errors.dist.message : null}
						/>

						<View style={styles.divide}>
							<View style={styles.divide1}>
								<CommonInput
									control={control}
									name="taluka"
									editable={true}
									rules={{
										required: "Taluka is required."
									}}
									placeholder={translator("account.taluka", language)}
									error={errors.taluka ? errors.taluka.message : null}
								/>
							</View>
							<View style={styles.divide1}>
								<CommonInput
									control={control}
									name="village"
									editable={true}
									rules={{
										required: "Village is required."
									}}
									placeholder={translator("account.village", language)}
									error={errors.village ? errors.village.message : null}
								/>
							</View>
						</View>
						<View style={{ flexDirection: 'row', alignItems: "center" }}>
							<Controller
								control={control}
								name="userAgree"
								rules={{
									required: true,
								}}
								render={({ field }) => (
									<CheckBox
										disabled={false}
										value={field.value}
										onValueChange={(newValue) => field.onChange(newValue)}
									/>
								)}
							/>
							<Text style={styles.iagree}>{translator("account.agree", language)} <Text style={styles.linktext} onPress={() => navigation.navigate('Terms')}>
								{translator("account.term", language)}</Text> {translator("account.and", language)}
								<Text style={styles.linktext} onPress={() => navigation.navigate('Privacy')}>{translator("account.privacy", language)}
								</Text>
								{translator("account.hiex", language)}
							</Text>
						</View>
						{errors.userAgree && <Text style={{ color: 'red' }}>*Required</Text>}
						<TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleSubmit(onSubmit)}>
							<Text style={styles.buttontext}>{translator("account.button", language)}</Text>
						</TouchableOpacity>
					</ScrollView>
					:
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<ActivityIndicator size={"large"} />
					</View>
			}
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 15,
		marginVertical: 20,
		flex: 1
	},
	input: {
		justifyContent: 'center',
		borderColor: Colors.secondary,
		borderWidth: 2,
		borderRadius: 5,
		padding: 10,

	},
	divide: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},
	divide1: {
		width: '48%'
	},
	button: {
		backgroundColor: Colors.secondary,
		padding: 10,
		justifyContent: 'center',
		borderRadius: 10,
		marginTop: 8
	},
	buttontext: {
		color: 'white',
		fontSize: 24,
		textAlign: 'center',
	},
	iagree: {
		fontSize: 16,
		fontWeight: '400',
	},
	linktext: {
		color: '#0096FF',
		fontWeight: '400',
	}
})