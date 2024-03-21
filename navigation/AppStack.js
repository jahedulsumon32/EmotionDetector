import 'react-native-gesture-handler';
import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Octicons from 'react-native-vector-icons/Octicons';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import VideosScreen from '../screens/VideosScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddPostScreen from '../screens/AddPostScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CrystalReport from '../screens/CrystalReport';
import EmotionDetectionScreen from '../screens/EmotionDetectionScreen';
import EmotionDetectionScreen2 from '../screens/EmotionDetectionScreen2';
import CrystalReport2 from '../screens/CrystalReport2';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator(); // Step 1: Create Drawer Navigator

const FeedStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="Write New Post-->"
      component={HomeScreen}
      options={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
          fontFamily: 'Kufam-SemiBoldItalic',
          fontSize: 21,
          marginTop: 100,
        },

        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
        // headerRight: () => (
        //   <View style={{marginRight: -15}}>
        //     <AntDesign.Button
        //       name="addfile"
        //       size={22}
        //       backgroundColor="#fff"
        //       color="#2e64e5"
        //       onPress={() => navigation.navigate('AddPost')}
        //     />
        //   </View>
        // ),
      }}
    />
    {/* <Stack.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#2e64e515',
          shadowColor: '#2e64e515',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    /> */}
    <Stack.Screen
      name="HomeProfile"
      component={ProfileScreen}
      options={{
        title: '',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <View style={{marginLeft: 15}}>
            <Ionicons name="arrow-back" size={25} color="#2e64e5" />
          </View>
        ),
      }}
    />
  </Stack.Navigator>
);

const ProfileStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{
        headerTitle: 'Edit Profile',
        headerBackTitleVisible: false,
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#fff',
          shadowColor: '#fff',
          elevation: 0,
        },
      }}
    />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#2e64e5',
      tabBarStyle: [
        {
          display: 'flex',
        },
        null,
      ],
    }}>
    <Tab.Screen
      name="Home1"
      component={FeedStack}
      options={{
        tabBarLabel: 'Home',
        title: '',
        hight: 10,
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons
            name="home-outline"
            color={color}
            size={size}
          />
        ),
      }}
    />

    <Tab.Screen
      name="EmotionDetector"
      component={EmotionDetectionScreen}
      options={{
        tabBarLabel: 'Emotion',
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons
            name="emoticon-outline"
            color={color}
            size={size}
          />
        ),
      }}
    />

    <Tab.Screen
      name="Add New Post"
      component={AddPostScreen}
      options={{
        tabBarLabel: 'Post',
        tabBarIcon: ({color, size}) => (
          <MaterialIcons name="add" color={color} size={size} />
        ),
      }}
    />

    <Tab.Screen
      name="Report"
      component={CrystalReport2}
      options={{
        tabBarLabel: 'Report',
        tabBarIcon: ({color, size}) => (
          <Octicons name="report" color={color} size={size} />
        ),
      }}
    />

    <Tab.Screen
      name="Profile"
      component={ProfileStack}
      options={{
        // tabBarLabel: 'Home',
        tabBarIcon: ({color, size}) => (
          <Ionicons name="person-outline" color={color} size={size} />
        ),
      }}
    />
  </Tab.Navigator>
);

const AppStack = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Drawer Home"
        component={TabNavigator}
        options={{
          title: 'EmoSphere',
          drawerLabel: 'Home',
        }}
      />

      <Drawer.Screen name="Google Map" component={MapScreen} />
      <Drawer.Screen name="Videos" component={VideosScreen} />
      {/* <Drawer.Screen name="Detector" component={EmotionDetectionScreen2} /> */}
    </Drawer.Navigator>
  );
};

export default AppStack;
