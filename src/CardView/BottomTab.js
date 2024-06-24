import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Cards from './WeatherCard';
import AddCrop from './AddCrop';
import ChatListScreen from './ChatListScreen';
import TopTabBar from '../components/TopTabBar';
import CarouselCards from './CarouselCards';
import LoginPage from '../components/LoginPage';
import Payment from '../components/Payment';
import FavCrop from './FavCrop';
import News from '../components/News';
import { Colors } from '../constants/Theme'
// import HomeScreen from '../components/HomeScreen';
import HomeScreen from '../screens/HomeScreen';
import SubscriptionList from '../components/SubscriptionList';
import { AuthContext } from '../../App';
import { translator } from '../locales/I18n';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
// import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import Videos from '../screens/Videos';
import CropProtection from './CropProtection';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: 'center'
	},
	text: {
		fontSize: 40,
	}
});


const Tab = createBottomTabNavigator();

export default function MyTabs() {
	const { language } = React.useContext(AuthContext);
	const navigation = useNavigation();

	async function bootstrap() {
		const initialNotification = await notifee.getInitialNotification();

		if (initialNotification) {
			console.log('Notification caused application to open', initialNotification.notification);
			console.log('Press action used to open the app', initialNotification.pressAction);
		}
	}

	useEffect(() => {
		bootstrap();
	}, []);
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarActiveTintColor: Colors.secondary,
				headerShown: false,
				tabBarStyle: {
					height: 68,
					padding: 10,
				},
				tabBarLabelStyle: {
					fontSize: 14,
					paddingBottom: 10,
				},
			}}
		>
			<Tab.Screen
				name="HomeTab"
				component={HomeScreen}
				options={{
					tabBarLabel: translator("navigator.home", language),
					tabBarIcon: ({ color }) => (
						<Ionicons name="home" color={color} size={25} />
					),
				}}
			/>
			<Tab.Screen
				name="Protection"
				component={CropProtection}
				listeners={({ navigation }) => ({
					tabPress: (e) => {
						e.preventDefault();
						navigation.navigate('CropsProtection');
					},
				})}
				options={{
					tabBarLabel: translator("home.news", language),
					tabBarIcon: ({ color }) => (
						<FontAwesome6 name="jar-wheat" color={color} size={25} />
					),
				}}
			/>
			
			<Tab.Screen
				name="Video"
				component={Videos}
				options={{
					tabBarLabel: translator("home.videos", language),
					tabBarIcon: ({ color }) => (
						<Ionicons name="videocam" color={color} size={25} />
					)
				}}
				listeners={({ navigation }) => ({
					tabPress: (e) => {
						e.preventDefault();
						navigation.navigate('Videos');
					},
				})}
			/>
			{/* <Tab.Screen
				name="Add Crop"
				options={{
					tabBarLabel: translator("home.crops", language),
					tabBarIcon: ({ color }) => (
						// <View
						// 	style={{
						// 		position: 'absolute',
						// 		bottom: -15,
						// 		height: 70,
						// 		width: 70,
						// 		padding: 0,
						// 		borderRadius: 100,
						// 		justifyContent: 'center',
						// 		alignItems: 'center',
						// 		backgroundColor: '#F5BD1F',
						// 	}}
						// >
						// 	<Ionicons name="add" color="black" size={55} />
						// </View>
						// <View style={{backgroundColor: '#F5BD1F', borderRadius:50,}}>
						<MaterialCommunityIcons name="flower-tulip-outline" color={color} size={30} />
						// </View>
					)
				}}
				component={FavCrop}
				listeners={({ navigation }) => ({
					tabPress: (e) => {
						e.preventDefault();
						navigation.navigate('FavCrop');
					},
				})}
			/> */}
			<Tab.Screen
				name="Krushi Book"
				// component={Payment}
				component={SubscriptionList}
				options={{
					tabBarLabel: translator("home.subscription", language),
					tabBarIcon: ({ color }) => (
						<FontAwesome5 name="rupee-sign" color={color} size={25} />
					),
				}}
				listeners={({ navigation, route }) => ({
					tabPress: (e) => {
						e.preventDefault();
						navigation.navigate('Subscription List');
					},
				})}
			/>
			<Tab.Screen
				name="Chat"
				component={ChatListScreen}
				options={{
					tabBarLabel: translator("navigator.chat", language),
					tabBarIcon: ({ color }) => (
						<Ionicons name="chatbubble-ellipses" color={color} size={25} />
					),
				}}
				listeners={({ navigation, route }) => ({
					tabPress: (e) => {
						e.preventDefault();
						navigation.navigate('Chats');
					},
				})}
			/>
		</Tab.Navigator>
	);
}