import { useColorScheme, View, Text, AppState, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import { mainColor, sideColor } from '../../../utils/ThemeColors'
import database from '@react-native-firebase/database'
import { AuthContext } from '../../../navigation/AuthProvider'
import IconOI from 'react-native-vector-icons/Octicons'

const Profile = ({ navigation }) => {

  const isDarkMode = useColorScheme() === 'dark';

  const { user, signOut } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});

  const getCurrentUser = () => {

    const reference = database().ref('/MyDiet/userList/' + user.uid);

    reference
      .on('value', snapshot => {

        setCurrentUser(snapshot.val());

      });

  }

  useEffect(() => {

    getCurrentUser();

    return () => {
      setCurrentUser({});
    }
  }, [])


  return (
    <SafeAreaView style={{
      width: '100%',
      height: '100%',
      padding: '2%',
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
      alignItems: 'center',
      justifyContent: 'center'
    }}>

      <TouchableOpacity onPress={() => {
        signOut();
      }} style={{
        position: 'absolute',
        top: '2%',
        right: '2%'
      }}>
        <IconOI
          name='sign-out'
          size={30}
          color={isDarkMode ? Colors.white : Colors.black}
        />
      </TouchableOpacity>

      <FastImage
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
        }}
        source={{
          uri: currentUser.ImageUrl,
          priority: FastImage.priority.normal
        }}
        resizeMode={FastImage.resizeMode.cover}
      />

      <View style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        width: '96%',
        elevation: 10,
        margin: '2%',
        padding: '5%',
        alignItems: 'center',
        marginVertical: '5%',
        borderWidth: 1,
        borderColor: isDarkMode ? Colors.darker : Colors.lighter,
        borderRadius: 8,
        shadowColor: isDarkMode ? Colors.white : Colors.black,
      }}>

        <View style={{
          alignItems: 'flex-end',
          marginRight: '2%',
          flexDirection: 'row'
        }}>
          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
            fontWeight: 'bold',
            marginRight: '5%'
          }}>
            Name:
          </Text>
          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
          }}>
            {currentUser.Name}
          </Text>
        </View>

        <View style={{
          alignItems: 'flex-start',
          flexDirection: 'row'
        }}>
          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
            fontWeight: 'bold',
            marginRight: '5%'
          }}>
            {
              moment().locale() == "tr" ?
                "Yaşım:" :
                "My Age:"
            }
          </Text>
          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
          }}>
            {currentUser.Age}
          </Text>
        </View>

      </View>

      <View style={{
        backgroundColor: isDarkMode ? Colors.black : Colors.white,
        width: '96%',
        elevation: 10,
        margin: '2%',
        padding: '5%',
        alignItems: 'center',
        marginVertical: '5%',
        borderWidth: 1,
        borderColor: isDarkMode ? Colors.darker : Colors.lighter,
        borderRadius: 8,
        shadowColor: isDarkMode ? Colors.white : Colors.black,
      }}>

        <View style={{
          alignItems: 'flex-end',
          marginRight: '2%',
          flexDirection: 'row'
        }}>
          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
            fontWeight: 'bold',
            marginRight: '5%'
          }}>
            {
              moment().locale() == "tr" ?
                "Kilom:" :
                "My Weight:"
            }
          </Text>
          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
          }}>
            {currentUser.MyWeight}
          </Text>
        </View>

        <View style={{
          alignItems: 'flex-end',
          marginRight: '2%',
          flexDirection: 'row'
        }}>
          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
            fontWeight: 'bold',
            marginRight: '5%'
          }}>
            {
              moment().locale() == "tr" ?
                "Boyum:" :
                "My Height:"
            }
          </Text>
          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
          }}>
            {currentUser.MyHeight}
          </Text>
        </View>

        <View style={{
          alignItems: 'flex-start',
          flexDirection: 'row'
        }}>
          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
            fontWeight: 'bold',
            marginRight: '5%'
          }}>
            {
              moment().locale() == "tr" ?
                "Vücut kitle indeksim:" :
                "My body mass index:"
            }
          </Text>
          <Text style={{
            color: isDarkMode ? Colors.white : Colors.black,
          }}>
            {((currentUser.MyWeight / (currentUser.MyHeight * currentUser.MyHeight)) * 10000).toFixed(0)}
          </Text>
        </View>

      </View>

      <TouchableOpacity onPress={() => {
        navigation.navigate("ProfileEdit")
      }} style={{
        backgroundColor: mainColor,
        width: '96%',
        margin: '2%',
        padding: '2%',
        borderRadius: 20,
        alignItems: 'center',
        marginVertical: '5%'
      }}>
        <Text style={{
          color: Colors.white,
          fontWeight: 'bold'
        }}>
          Edit Profile
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

export default Profile