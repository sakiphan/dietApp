import { useColorScheme, View, Text, SafeAreaView, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import moment from 'moment'
import { mainColor, sideColor } from '../../../utils/ThemeColors'
import IconII from 'react-native-vector-icons/Ionicons'
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons'
import FoodInfo from './FoodInfo'

const Home = ({ navigation }) => {

  const isDarkMode = useColorScheme() === 'dark';

  const [foodData, setFoodData] = useState({})
  const [wantedFood, setWantedFood] = useState('');

  function getFood(foodName) {

    if (foodName != '') {

      const options = {
        method: 'GET',
        headers: {
          'x-app-id': "f3739d02",
          'x-app-key': "ccbff610db298277d5a04a346b6936c7",
        }
      };
      fetch('https://trackapi.nutritionix.com/v2/search/instant?query=${' + foodName + '}&common=true&detailed=true', options)
        .then(response => response.json())
        .then(response => setFoodData(response.branded))
        .catch(err => console.error(err));

    } else {
      setFoodData({})
    }

  }

  function renderItem({ item, index }) {

    return (
      <React.Fragment>
        <FoodInfo
          navigation={navigation}
          item={item}
        />
      </React.Fragment>
    )

  }

  useEffect(() => {

    getFood('');

    return () => {
      setFoodData({});
    }
  }, [])


  return (
    <SafeAreaView style={{
      width: '100%',
      height: '100%',
      backgroundColor: isDarkMode ? Colors.black : Colors.white
    }}>

      <View style={{
        width: '96%',
        marginBottom: '1%',
        elevation: 20,
        margin: '2%',
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        borderWidth: 1,
        borderColor: isDarkMode ? Colors.darker : Colors.lighter,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        shadowColor: isDarkMode ? Colors.white : Colors.black,
      }}>

        <TextInput
          style={{
            width: '90%',
            height: 40,
            padding: '2%',
          }}
          placeholder={
            moment().locale() == "tr" ?
              "Yiyecek Ara" : "Search Food"
          }
          color={isDarkMode ? Colors.white : Colors.black}
          onChangeText={value => { setWantedFood(value); getFood(value) }}
        />

        <IconII
          name='search-outline'
          size={20}
          color={isDarkMode ? Colors.white : Colors.black}
        />

      </View>

      {
        foodData.length == undefined ?
          <View style={{
            width: '70%',
            height: 200,
            marginHorizontal: '15%',
            marginTop: '60%',
            elevation: 10,
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: isDarkMode ? Colors.darker : Colors.lighter,
            borderRadius: 8,
            shadowColor: isDarkMode ? Colors.white : Colors.black,
          }}>

            <IconMCI
              name='food-variant'
              size={100}
              color={mainColor}
            />

          </View>
          :
          foodData.length == 0 &&
          <Text style={{
            fontWeight: 'bold',
            fontSize: 24,
            textAlign: 'center',
            color: isDarkMode ? Colors.lighter : Colors.darker
          }}>
            {
              moment().locale() == "tr" ?
                "Yemek Bulunamadı" :
                "Food Not Found"
            }
          </Text> ||
          <FlatList
            data={foodData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
      }

    </SafeAreaView >
  )
}

export default Home

/*

function getFood() {

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'f992cdfdb3mshd2ad243af75fe25p17538fjsn0bb1d00115e4',
        'X-RapidAPI-Host': 'edamam-food-and-grocery-database.p.rapidapi.com'
      }
    };
    fetch('https://edamam-food-and-grocery-database.p.rapidapi.com/parser?ingr=egg', options)
      .then(response => response.json())
      .then(response => setFoodDta(response.hints))
      .catch(err => console.error(err));



  }

  */