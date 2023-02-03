import { useColorScheme, View, Text, AppState, SafeAreaView, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import { mainColor, sideColor } from '../../../utils/ThemeColors'

import { AuthContext } from '../../../navigation/AuthProvider'
import IconOI from 'react-native-vector-icons/Octicons'
import MealProgramInfo from './MealProgramInfo'
import database from '@react-native-firebase/database'

const MealProgram = ({ navigation }) => {

  const isDarkMode = useColorScheme() === 'dark';

  const { user } = useContext(AuthContext);

  const [mealProgramMorningData, setMealProgramMorningData] = useState({});
  const [mealProgramNoonData, setMealProgramNoonData] = useState({});
  const [mealProgramEveningData, setMealProgramEveningData] = useState({});
  const [totalCaloriesMorning, setTotalCaloriesMorning] = useState(0);
  const [totalCaloriesNoon, setTotalCaloriesNoon] = useState(0);
  const [totalCaloriesEvening, setTotalCaloriesEvening] = useState(0);

  function getMorningMealProgram() {

    const reference = database().ref("/MyDiet/FoodProgram/Morning/" + user.uid);
    reference
      .on('value', snapshot => {

        if (snapshot.val() != null) {
          setMealProgramMorningData(Object.values(snapshot.val()));

          let a = 0;

          for (let i = 0; i < Object.values(snapshot.val()).length; i++) {
            a += Object.values(snapshot.val())[i].item.nf_calories;
          } setTotalCaloriesMorning(a);

        } else {
          setMealProgramMorningData({});
        }

      });

  }
  function getNoonMealProgram() {

    const reference = database().ref("/MyDiet/FoodProgram/Noon/" + user.uid);
    reference
      .on('value', snapshot => {

        if (snapshot.val() != null) {
          setMealProgramNoonData(Object.values(snapshot.val()));

          let a = 0;

          for (let i = 0; i < Object.values(snapshot.val()).length; i++) {
            a += Object.values(snapshot.val())[i].item.nf_calories;
          } setTotalCaloriesNoon(a);

        } else {
          setMealProgramNoonData({});
        }

      });

  }
  function getEveningMealProgram() {

    const reference = database().ref("/MyDiet/FoodProgram/Evening/" + user.uid);
    reference
      .on('value', snapshot => {

        if (snapshot.val() != null) {
          setMealProgramEveningData(Object.values(snapshot.val()));

          let a = 0;

          for (let i = 0; i < Object.values(snapshot.val()).length; i++) {
            a += Object.values(snapshot.val())[i].item.nf_calories;
          } setTotalCaloriesEvening(a);

        } else {
          setMealProgramEveningData({});
        }

      });

  }

  function renderItemMorning({ item, index }) {

    return (
      <MealProgramInfo
        navigation={navigation}
        item={item.item}
      />
    )

  }
  function renderItemNoon({ item, index }) {

    return (
      <MealProgramInfo
        navigation={navigation}
        item={item.item}
      />
    )

  }
  function renderItemEvening({ item, index }) {

    return (
      <MealProgramInfo
        navigation={navigation}
        item={item.item}
      />
    )

  }

  useEffect(() => {

    getMorningMealProgram();
    getNoonMealProgram();
    getEveningMealProgram();

    return () => {
      setMealProgramMorningData({});
      setMealProgramNoonData({});
      setMealProgramEveningData({});
    }

  }, []);


  return (
    <SafeAreaView style={{
      width: '100%',
      height: '100%',
      padding: '2%',
      backgroundColor: isDarkMode ? Colors.black : Colors.white
    }}>

      <View style={{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: isDarkMode ? Colors.white : Colors.black
      }}>

        <Text style={{
          color: isDarkMode ? Colors.light : Colors.dark,
          fontWeight: 'bold',
          fontSize: 24,
          marginRight: '10%'
        }}>
          {
            moment().locale() == "tr" ?
              "Sabah" : "Morning"
          }
        </Text>

        <Text style={{
          color: isDarkMode ? Colors.light : Colors.dark,
          fontWeight: 'bold',
          fontSize: 14,
        }}>
          {
            moment().locale() == "tr" ?
              "Toplam Kalori: " : "Total Calories: "
          }
        </Text>

        <Text style={{
          color: isDarkMode ? Colors.light : Colors.dark,
          fontSize: 14,
        }}>
          {totalCaloriesMorning.toFixed(0)}
        </Text>

      </View>

      {
        mealProgramMorningData.length == undefined ?
          <Text style={{
            fontSize: 16,
            color: isDarkMode ? Colors.white : Colors.black,
            textAlign: 'center',
            marginTop: '5%'
          }}>
            {
              moment().locale() == "tr" ?
                "Henüz Sabah Programı Hazırlanmamamış." : "Morning Program Has Not Been Prepared Yet."
            }
          </Text>
          :
          <FlatList style={{
            marginHorizontal: '2%',
          }}
            data={mealProgramMorningData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItemMorning}
          />
      }

      <View style={{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: isDarkMode ? Colors.white : Colors.black
      }}>

        <Text style={{
          color: isDarkMode ? Colors.light : Colors.dark,
          fontWeight: 'bold',
          fontSize: 24,
          marginRight: '10%'
        }}>
          {
            moment().locale() == "tr" ?
              "Öğlen" : "Noon"
          }
        </Text>

        <Text style={{
          color: isDarkMode ? Colors.light : Colors.dark,
          fontWeight: 'bold',
          fontSize: 14,
        }}>
          {
            moment().locale() == "tr" ?
              "Toplam Kalori: " : "Total Calories: "
          }
        </Text>

        <Text style={{
          color: isDarkMode ? Colors.light : Colors.dark,
          fontSize: 14,
        }}>
          {totalCaloriesNoon.toFixed(0)}
        </Text>

      </View>

      {
        mealProgramNoonData.length == undefined ?
          <Text style={{
            fontSize: 16,
            color: isDarkMode ? Colors.white : Colors.black,
            textAlign: 'center',
            marginTop: '5%'
          }}>
            {
              moment().locale() == "tr" ?
                "Henüz Öğlen Programı Hazırlanmamamış." : "Noon Program Has Not Been Prepared Yet."
            }
          </Text>
          :
          <FlatList style={{
            marginHorizontal: '2%'
          }}
            data={mealProgramNoonData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItemNoon}
          />
      }

      <View style={{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: isDarkMode ? Colors.white : Colors.black
      }}>

        <Text style={{
          color: isDarkMode ? Colors.light : Colors.dark,
          fontWeight: 'bold',
          fontSize: 24,
          marginRight: '10%'
        }}>
          {
            moment().locale() == "tr" ?
              "Akşam" : "Evening"
          }
        </Text>

        <Text style={{
          color: isDarkMode ? Colors.light : Colors.dark,
          fontWeight: 'bold',
          fontSize: 14,
        }}>
          {
            moment().locale() == "tr" ?
              "Toplam Kalori: " : "Total Calories: "
          }
        </Text>

        <Text style={{
          color: isDarkMode ? Colors.light : Colors.dark,
          fontSize: 14,
        }}>
          {totalCaloriesEvening.toFixed(0)}
        </Text>

      </View>

      {
        mealProgramEveningData.length == undefined ?
          <Text style={{
            fontSize: 16,
            color: isDarkMode ? Colors.white : Colors.black,
            textAlign: 'center',
            marginTop: '5%'
          }}>
            {
              moment().locale() == "tr" ?
                "Henüz Akşam Programı Hazırlanmamamış." : "Evening Program Has Not Been Prepared Yet."
            }
          </Text>
          :
          <FlatList style={{
            marginHorizontal: '2%'
          }}
            data={mealProgramEveningData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItemEvening}
          />
      }


    </SafeAreaView>
  )
}

export default MealProgram