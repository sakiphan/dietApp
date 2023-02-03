import { useColorScheme, View, Text, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import moment from 'moment'
import FastImage from 'react-native-fast-image'

const FoodInfo = ({ navigation, item }) => {

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TouchableOpacity onPress={() => {
      navigation.navigate("FoodDetails", {
        item: item
      });
    }} style={{
      width: '96%',
      padding: '2%',
      marginBottom: '3%',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: isDarkMode ? Colors.darker : Colors.lighter,
      borderRadius: 8,
      elevation: 10,
      shadowColor: isDarkMode ? Colors.white : Colors.black,
      margin: '2%',
      backgroundColor: isDarkMode ? Colors.black : Colors.white
    }}>

      <View style={{
        width: '25%'
      }}>

        <FastImage
          style={{
            width: '100%',
            height: 100
          }}
          source={{
            uri: item.photo.thumb != undefined ?
              item.photo.thumb :
              "https://spsajans.com/wp-content/themes/unbound/images/No-Image-Found-400x264.png",
            priority: FastImage.priority.normal
          }}
          resizeMode={FastImage.resizeMode.cover}
        />

        <Text style={{
          textAlign: 'center',
          color: isDarkMode ? Colors.white : Colors.black,
          fontWeight: 'bold'
        }}>
          {item.food_name}
        </Text>

      </View>

      <View style={{
        width: '70%',
        marginLeft: '5%',
        justifyContent: 'center'
      }}>

        <View style={{
          flexDirection: 'row',
          marginBottom: '10%',
          width: '100%'
        }}>

          <Text style={{
            fontWeight: 'bold',
            color: isDarkMode ? Colors.white : Colors.black,
            width: '30%',
            textAlign: 'center'
          }}>
            Qty
          </Text>

          <Text style={{
            fontWeight: 'bold',
            color: isDarkMode ? Colors.white : Colors.black,
            marginHorizontal: '5%',
            width: '30%',
            textAlign: 'center'
          }}>
            Calories
          </Text>

          <Text style={{
            fontWeight: 'bold',
            color: isDarkMode ? Colors.white : Colors.black,
            width: '30%',
            textAlign: 'center',
          }}>
            Brand
          </Text>

        </View>

        <View style={{
          flexDirection: 'row',
          width: '100%'
        }}>

          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
            width: '30%',
            textAlign: 'center'
          }}>
            {item.serving_qty}
          </Text>

          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
            marginHorizontal: '5%',
            width: '30%',
            textAlign: 'center'
          }}>
            {item.nf_calories}
          </Text>

          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
            width: '30%',
            textAlign: 'center',
            height: 40
          }}>
            {item.brand_name}
          </Text>

        </View>

      </View>

    </TouchableOpacity>
  )
}

export default FoodInfo