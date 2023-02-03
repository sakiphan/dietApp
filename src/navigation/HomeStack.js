import { useColorScheme, View, Text, AppState } from 'react-native'
import React, { useEffect, useRef, useState, useContext } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import { mainColor, sideColor } from '../utils/ThemeColors'
import database from '@react-native-firebase/database'
import { AuthContext } from './AuthProvider'

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons'
import IconII from 'react-native-vector-icons/Ionicons'
import Home from '../screens/Home/Home/Home'
import MealProgram from '../screens/Home/MealProgram/MealProgram'
import Profile from '../screens/Home/Profile/Profile'
import ProfileEdit from '../screens/Home/Profile/ProfileEdit'
import FoodDetails from '../screens/Home/Food/FoodDetails'

const HomeStack = () => {

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const [currentUser, setCurrentUser] = useState({})

  const { user } = useContext(AuthContext);
  const [aState, setAppState] = useState(AppState.currentState);

  const getCurrentUser = () => {

    const reference = database().ref('/MyDiet/userList/' + user.uid);

    reference
      .on('value', snapshot => {

        setCurrentUser(snapshot.val());

      });

  }

  useEffect(() => {
    getCurrentUser();
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {

        if (nextAppState == "active") {

          const activeReference = database().ref('/MyDiet/userList/' + user.uid);

          activeReference
            .update({
              OnlineStatus: true
            });


          setAppState(nextAppState);

        } else {

          const inactiveReference = database().ref('/MyDiet/userList/' + user.uid);

          inactiveReference
            .update({
              OnlineStatus: false
            });

          setAppState(nextAppState);

        }

      },
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const TabStack = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              return <IconFA5 name='home' color={focused ? mainColor : isDarkMode && Colors.light || Colors.dark} size={30} />
            } else if (route.name === 'MealProgram') {
              return <IconMCI name='silverware-fork-knife' color={focused ? mainColor : isDarkMode && Colors.light || Colors.dark} size={30} />
            } else {
              return <FastImage
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: isDarkMode ? Colors.white : Colors.black
                }}
                source={{
                  uri: currentUser.ImageUrl,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
            }
          },
          tabBarActiveTintColor: mainColor,
          tabBarInactiveTintColor: '#aaa',
          headerShown: false,
          tabBarStyle: { backgroundColor: isDarkMode ? Colors.black : Colors.white },
          tabBarHideOnKeyboard: true
        })} >
        <Tab.Screen
          name='Home'
          component={Home}
          options={{
            headerShown: false,
            tabBarShowLabel: false
          }} />
        <Tab.Screen
          name='MealProgram'
          component={MealProgram}
          options={{
            headerShown: false,
            tabBarShowLabel: false
          }}
        />
        <Tab.Screen
          name='Profile'
          component={Profile}
          options={{
            headerShown: false,
            tabBarShowLabel: false
          }} />
      </Tab.Navigator>
    )
  }
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator>
        <Stack.Screen
          name='HomeScreen'
          component={TabStack}
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name='MealProgram'
          component={MealProgram}
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name='Profile'
          component={Profile}
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name='ProfileEdit'
          component={ProfileEdit}
          options={{
            title: moment().locale() == "tr" ?
              "Profili Düzenle"
              :
              "Profile Edit",
            headerTintColor: mainColor,
            headerStyle: {
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }
          }}
        />

        <Stack.Screen
          name='FoodDetails'
          component={FoodDetails}
          options={{
            title: moment().locale() == "tr" ?
              "Yiyecek Detayı"
              :
              "Food Details",
            headerTintColor: mainColor,
            headerStyle: {
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default HomeStack