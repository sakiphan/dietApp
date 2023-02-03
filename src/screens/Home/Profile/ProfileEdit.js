import { useColorScheme, View, Text, Alert, SafeAreaView, TouchableOpacity, FlatList, Image, ScrollView, TextInput, Button, Modal } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import FastImage from 'react-native-fast-image'
import moment from 'moment'
import { mainColor, sideColor } from '../../../utils/ThemeColors'
import IconFA5 from 'react-native-vector-icons/FontAwesome5'

import { AuthContext } from '../../../navigation/AuthProvider'
import database from '@react-native-firebase/database'

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'
import { ActivityIndicator } from 'react-native-paper'

const color = '#aaa';

const ProfileEdit = ({ navigation }) => {

  const isDarkMode = useColorScheme() === 'dark';

  const { signOut, user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserName, setCurrentUserName] = useState('');
  const [currentUserAge, setCurrentUserAge] = useState(0);
  const [currentUserWeight, setCurrentUserWeight] = useState(0);
  const [currentUserHeight, setCurrentUserHeight] = useState(0);
  const [errorCurrentUserAge, seterrorCurrentUserAge] = useState(false);
  const [errorCurrentUserName, seterrorCurrentUserName] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState();
  const [uploadTask, setUploadTask] = useState();
  const [uploadTaskSnapshot, setUploadTaskSnapshot] = useState({});
  const [state, setState] = useState({});
  const [durum, setDurum] = useState(false);
  const [updated, setUpdated] = useState(false);

  const getCurrentUser = () => {

    const reference = database().ref('/MyDiet/userList/' + user.uid);

    reference
      .on('value', snapshot => {

        if (snapshot.val() != null) {
          setCurrentUser(snapshot.val());
          setCurrentUserName(snapshot.val().Name);
          setCurrentUserAge(snapshot.val().Age);
          setCurrentUserWeight(snapshot.val().MyWeight);
          setCurrentUserHeight(snapshot.val().MyHeight);
        }

      });

  }

  const updateCurrentUser = () => {
    setisLoading(true)
    if (currentUserAge < 0) {
      seterrorCurrentUserAge(true)
      setisLoading(false)
    } else if (currentUserName.length < 3) {
      seterrorCurrentUserName(true)
      setisLoading(false)
    } else {
      seterrorCurrentUserAge(false)

      const reference1 = database().ref('/MyDiet/userList/' + user.uid);
      reference1
        .update({
          Name: currentUserName,
          Age: currentUserAge,
          MyWeight: currentUserWeight,
          MyHeight: currentUserHeight,
        });

      user.updateProfile({
        displayName: currentUserName,
      });
      setisLoading(false)
      onUpdated();
      getCurrentUser()

    }

  };

  const onSelectImagePress = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1.0, noData: true }, onMediaSelect)
  };

  const onMediaSelect = media => {

    if (!media.cancelled) {
      if (media.assets != undefined) {
        setIsUploading(true);
        const reference = storage().ref("Uploads/Users/" + currentUser.Email);

        const task = reference.putFile(media.assets[0].uri);

        setUploadTask(task);
        task.on('state_changed', taskSnapshot => {
          setUploadTaskSnapshot(taskSnapshot);
        });
        task.then(() => {

          const downloadURL = reference.getDownloadURL();
          setDownloadUrl(downloadURL);
          setIsUploading(false);
          setUploadTaskSnapshot({});

          setDurum(true)

        })
      }
    }
  };

  const updateImage = () => {
    if (downloadUrl != undefined) {
      const reference1 = database().ref('/MyDiet/userList/' + user.uid);
      reference1
        .update({
          ImageUrl: downloadUrl._W
        });
    } else {
      Alert.alert("Hata", "Resim Yüklenemedi Lütfen Tekrar Deneyiniz.")
    }
    onUpdated();
    getCurrentUser();

  }


  const errorNickName = () => {
    if (errorCurrentUserAge) {

      Alert.alert("Kullanıcı Adı Düzeltme İşlemi", "Kullanıcı Adınız en az 5 en fazla 20 karakter olmalıdır")
      getCurrentUser()
      seterrorCurrentUserAge(false)

    }
    else {
    }
  }

  const errorName = () => {
    if (errorCurrentUserName) {

      Alert.alert("Ad Düzeltme İşlemi", "Adınız en az 3 karakter olmalıdır")
      getCurrentUser()
      seterrorCurrentUserName(false)

    }
    else {
    }
  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onUpdated = () => {

    setUpdated(true);
    wait(2000).then(() => {
      setUpdated(false);
    });

  }

  useEffect(() => {

    setCurrentUser({});
    getCurrentUser();
    setState({});
    return () => {
      setCurrentUser({});
      setCurrentUser({});
    };

  }, []);

  return (
    <SafeAreaView style={{
      width: '100%',
      height: '100%',
      backgroundColor: isDarkMode ? Colors.black : Colors.white,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5
    }}>
      {
        updated &&
        <View style={{
          position: 'absolute',
          top: 40,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          flexDirection: 'row'
        }}>

          <Text style={{
            color: 'green',
            fontSize: 24,
            marginRight: 5
          }}>
            {
              moment().locale() == "tr" ?
                "Güncelleme Başarılı"
                :
                "Update Successful"
            }
          </Text>
          <IconFA5 name='check-circle' color="green" size={24} />

        </View>
      }

      {isUploading ?
        <View style={{ justifyContent: 'center' }}>
          <ActivityIndicator size={30} color={mainColor} />
          <Text style={{ fontSize: 30, color: isDarkMode ? Colors.white : Colors.black }}>
            {(
              (uploadTaskSnapshot.bytesTransferred
                /
                uploadTaskSnapshot.totalBytes) * 100
            ).toFixed(2) + " %"}
          </Text>
        </View>

        :
        durum != true &&

        <TouchableOpacity
          onPress={() => {
            onSelectImagePress();
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            margin: 10,
            justifyContent: 'center',
          }}>

          <FastImage
            style={{ flex: 1, borderRadius: 50 }}
            source={{
              uri: currentUser.ImageUrl,
              priority: FastImage.priority.high,
              cache: FastImage.cacheControl.immutable
            }}
            resizeMode={FastImage.resizeMode.cover}
          />

          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            position: 'absolute',
            bottom: 0,
            right: 3,
            borderWidth: 2,
            borderColor: isDarkMode ? Colors.black : Colors.white,
            backgroundColor: isDarkMode ? Colors.white : Colors.black,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconFA5 name='camera' size={18} color={isDarkMode ? Colors.black : Colors.white} />
          </View>

        </TouchableOpacity>

      }

      {durum &&
        <TouchableOpacity onPress={() => {
          updateImage()
          setDurum(false)
        }} style={{ justifyContent: 'center' }}>
          <Text style={{ fontSize: 25, color: mainColor }}>
            {
              moment().locale() == "tr" ?
                "Güncelle"
                :
                "Update"
            }
          </Text>
        </TouchableOpacity>
      }


      <TextInput
        name="name"
        placeholder={
          moment().locale() == "tr" ?
            "Adınız"
            :
            "Your Name"
        }
        style={{
          width: '96%',
          height: 50,
          padding: '2%',
          marginBottom: '2%',
          elevation: 10,
          margin: '2%',
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          paddingHorizontal: '5%',
          borderWidth: 1,
          borderColor: isDarkMode ? Colors.darker : Colors.lighter,
          borderRadius: 8,
          shadowColor: isDarkMode ? Colors.white : Colors.black,
        }}
        placeholderTextColor={isDarkMode ? Colors.light : '#aaa'}
        onChangeText={value => setCurrentUserName(value)}
        value={currentUserName}
      />

      {errorName()}

      <TextInput
        name="nickname"
        placeholder={
          moment().locale() == "tr" ?
            "Yaşınız"
            :
            "Your Age"
        }
        style={{
          width: '96%',
          height: 50,
          padding: '2%',
          marginBottom: '2%',
          elevation: 10,
          margin: '2%',
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          paddingHorizontal: '5%',
          borderWidth: 1,
          borderColor: isDarkMode ? Colors.darker : Colors.lighter,
          borderRadius: 8,
          shadowColor: isDarkMode ? Colors.white : Colors.black,
        }}
        placeholderTextColor={isDarkMode ? Colors.light : '#aaa'}
        onChangeText={value => setCurrentUserAge(value)}
        value={currentUserAge}
      />

      {errorNickName()}

      <TextInput
        name="biography"
        placeholder={
          moment().locale() == "tr" ?
            "Kilonuz"
            :
            "Your Weight"
        }
        style={{
          width: '96%',
          height: 50,
          padding: '2%',
          marginBottom: '2%',
          elevation: 10,
          margin: '2%',
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          paddingHorizontal: '5%',
          borderWidth: 1,
          borderColor: isDarkMode ? Colors.darker : Colors.lighter,
          borderRadius: 8,
          shadowColor: isDarkMode ? Colors.white : Colors.black,
        }}
        multiline={true}
        placeholderTextColor={isDarkMode ? Colors.light : '#aaa'}
        onChangeText={value => setCurrentUserWeight(value)}
        value={currentUserWeight}
      />

      <TextInput
        name="website"
        placeholder={
          moment().locale() == "tr" ?
            "Boyunuz"
            :
            "Your Height"
        }
        style={{
          width: '96%',
          height: 50,
          padding: '2%',
          marginBottom: '2%',
          elevation: 10,
          margin: '2%',
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
          paddingHorizontal: '5%',
          borderWidth: 1,
          borderColor: isDarkMode ? Colors.darker : Colors.lighter,
          borderRadius: 8,
          shadowColor: isDarkMode ? Colors.white : Colors.black,
        }}
        placeholderTextColor={isDarkMode ? Colors.light : '#aaa'}
        onChangeText={value => setCurrentUserHeight(value)}
        value={currentUserHeight}
      />

      <TouchableOpacity onPress={() => {
        updateCurrentUser()
      }} style={{
        width: '75%',
        marginHorizontal: '12.5%',
        marginTop: '5%',
        backgroundColor: mainColor,
        padding: '2%',
        elevation: 10,
        borderRadius:10
      }}>
        <Text style={{
          color: Colors.white,
          textAlign: 'center'
        }}>
          {
            moment().locale() == "tr" ?
              "Güncelle"
              :
              "Update"
          }
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

export default ProfileEdit