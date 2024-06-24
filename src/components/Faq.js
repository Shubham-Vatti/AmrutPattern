import React, { useEffect, useState, useContext } from 'react';
import { Text, ScrollView, View, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
// import { Icon, ListItem } from 'react-native-elements';
import { ListItem } from '@rneui/themed';
import { Colors } from '../constants/Theme';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from '../../App';
import Config from 'react-native-config';

function Faq() {

	const [faqList, setFaqList] = useState([]);
	const { signOut, language, isNetworkAvailable ,AppVersion} = useContext(AuthContext)
	const [expanded, setExpanded] = useState("");

	useEffect(() => {
		const getToken = async () => {
			let checkToken = await AsyncStorageLib.getItem("amrut_session");
			if (checkToken == null) {
				signOut();
			}
			const getFaqApiUrl = `${Config.API_BASE_URL}/faqs?language=${language}&version=${AppVersion}`;
			axios.get(getFaqApiUrl, { headers: { 'Authorization': checkToken } })
				.then((res) => {
					if (res.data.success == true) {

						setFaqList(res.data.response);
						console.log(res.data.response);
					} else {
						console.log("hello")
					}
				})
		}
		getToken();
	}, [isNetworkAvailable])

	// const [faqList, setFaqList] = useState([...faqDetails]);
	const toggleDropdown = (index) => {
		faqList[index].isVisible = !faqList[index].isVisible;
		setFaqList([...faqList]);
	};
	return (
		<ScrollView style={{ backgroundColor: Colors.bodybackground }}>
			{
				faqList.map((item, index) => (
					<View style={{ ...styles.subContainer, marginTop: index === 0 ? 10 : 0 }} key={index}>
						<ListItem.Accordion
							content={
								<ListItem.Content >
									<View style={{ flexDirection: 'row' }} >
										<Text style={{ paddingRight: 2, fontSize: 18, fontWeight: 'bold' }}> {index + 1} </Text>
										<ListItem.Title style={{ fontSize: 18, fontWeight: '500' }}> {item.question} </ListItem.Title>
									</View>

								</ListItem.Content>
							}
							isExpanded={expanded === index}
							onPress={() => {
								if (expanded === index) {
									setExpanded("");
								} else {
									setExpanded(index);
								}
							}}
						>
							<ListItem >
								<ListItem.Title style={{ borderTopWidth: 1, paddingTop: 10 }}>{item.answer}</ListItem.Title>
							</ListItem>

						</ListItem.Accordion>

					</View>
				))
			}
		</ScrollView>
	)
}


const styles = StyleSheet.create({
	subContainer: {
		marginHorizontal: 10,
		marginBottom: 10,
	},
});


export default Faq;