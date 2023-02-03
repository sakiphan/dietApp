import { useColorScheme, View, Text, SafeAreaView, TextInput, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import moment from 'moment'
import FastImage from 'react-native-fast-image'
import { mainColor, sideColor } from '../../../utils/ThemeColors'
import { AuthContext } from '../../../navigation/AuthProvider'
import database from '@react-native-firebase/database'
import IconII from 'react-native-vector-icons/Ionicons'
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons'
import SelectDropdown from 'react-native-select-dropdown'

const FoodDetails = ({ navigation, route }) => {

    const isDarkMode = useColorScheme() === 'dark';
    const { signOut, user } = useContext(AuthContext);
    const { item } = route.params;

    const foodTimeList = ["Morning", "Noon", "Evening"];
    const [foodTime, setFoodTime] = useState('');
    const [isFoodInProgram, setIsFoodInProgram] = useState(false);

    function foodControl() {

        const reference = database().ref("/MyDiet/FoodProgram/" + foodTime + "/" + user.uid + "/" + item.nix_brand_id);
        reference
            .once('value')
            .then(snapshot => {
                if (snapshot.val() != null) {
                    setIsFoodInProgram(true);
                } else {
                    setIsFoodInProgram(false);
                }
            });

    }

    function addToFoodProgram() {

        if (isFoodInProgram) {
            if (foodTime != '') {
                const reference = database().ref("/MyDiet/FoodProgram/" + foodTime + "/" + user.uid + "/" + item.nix_brand_id);
                reference.remove().then(() => { foodControl(); });

            }
            else {
                Alert.alert(
                    moment().locale() == "tr" ?
                        "Hata" : "Error",
                    moment().locale() == "tr" ?
                        "Lütfen Zaman Seçiminizi Yapınız..." : "Please Make Your Time Selection..."
                )
            }
        } else {
            if (foodTime != '') {
                const reference = database().ref("/MyDiet/FoodProgram/" + foodTime + "/" + user.uid + "/" + item.nix_brand_id);
                reference.set({ item: item, time: foodTime }).then(() => {
                    foodControl();
                });

            }
            else {
                Alert.alert(
                    moment().locale() == "tr" ?
                        "Hata" : "Error",
                    moment().locale() == "tr" ?
                        "Lütfen Zaman Seçiminizi Yapınız..." : "Please Make Your Time Selection..."
                )
            }
        }

    }

    useEffect(() => {

        foodControl();

        return () => {

        }
    }, [foodTime])


    return (
        <SafeAreaView style={{
            width: '100%',
            height: '100%',
            padding: '2%',
            backgroundColor: isDarkMode ? Colors.black : Colors.white
        }}>

            <FastImage
                style={{
                    width: '100%',
                    height: '35%'
                }}
                source={{
                    uri: item.photo.thumb != undefined ?
                        item.photo.thumb :
                        "https://spsajans.com/wp-content/themes/unbound/images/No-Image-Found-400x264.png",
                    priority: FastImage.priority.normal
                }}
                resizeMode={FastImage.resizeMode.contain}
            />

            <Text style={{
                textAlign: 'center',
                color: isDarkMode ? Colors.light : Colors.dark,
                fontWeight: 'bold',
                fontSize: 20
            }}>
                {item.food_name}
            </Text>

            <ScrollView style={{
                width: '100%',
                marginVertical: '1%'
            }}>

                {item.full_nutrients[0] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>protein : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[0].value} gr</Text>
                    </View>
                )}

                {item.full_nutrients[1] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>fat : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[1].value} gr</Text>
                    </View>
                )}

                {item.full_nutrients[2] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Carbohydrate : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[2].value} gr</Text>
                    </View>)}
                {item.full_nutrients[3] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Energy : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[3].value} kcal</Text>
                    </View>)}
                {item.full_nutrients[4] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Sugar : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[4].value} gr</Text>
                    </View>)}
                {item.full_nutrients[5] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Sugar Added : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[5].value} gr</Text>
                    </View>)}
                {item.full_nutrients[6] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Fiber : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[6].value} gr</Text>
                    </View>)}
                {item.full_nutrients[7] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Calcium : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[7].value} mg</Text>
                    </View>)}
                {item.full_nutrients[8] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Iron : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[8].value} mg</Text>
                    </View>)}
                {item.full_nutrients[9] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Potassium : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[9].value} mg</Text>
                    </View>)}
                {item.full_nutrients[10] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Sodium : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[10].value} mg</Text>
                    </View>)}
                {item.full_nutrients[11] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Vitamin D : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[11].value} IU</Text>
                    </View>)}
                {item.full_nutrients[12] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Vitamin D (D2 , D3)  : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[12].value} Âµg</Text>
                    </View>)}
                {item.full_nutrients[13] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Cholesterol : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[13].value} mg</Text>
                    </View>)}
                {item.full_nutrients[14] && (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Fatty acids : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[14].value} mg</Text>
                    </View>)}
                {item.full_nutrients[15] && (<View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Fatty acids , total satuared :  </Text>
                    <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[15].value} g</Text>
                </View>)}
                {item.full_nutrients[16] && (<View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Fatty acids, total monounsaturated : </Text>
                    <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[16].value} g</Text>
                </View>)}
                {item.full_nutrients[17] && (
                    <View style={{ marginBottom: 5, flexDirection: 'row' }}>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black, fontWeight: 'bold' }}>Fatty acids, total polyunsaturated : </Text>
                        <Text style={{ color: isDarkMode ? Colors.white : Colors.black }}>{item.full_nutrients[17].value} g</Text>
                    </View>)}


            </ScrollView>

            <View style={{
                width: '100%',
                padding: '2%',
                marginVertical: '2%',
                elevation: 10,
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
                borderWidth: 1,
                borderColor: isDarkMode ? Colors.darker : Colors.lighter,
                borderRadius: 8,
                shadowColor: isDarkMode ? Colors.white : Colors.black,
                flexDirection: 'row'
            }}>

                <SelectDropdown
                    buttonStyle={{
                        width: '45%',
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: isDarkMode ? Colors.white : Colors.black,
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                    }} buttonTextStyle={{
                        color: isDarkMode ? Colors.white : Colors.black
                    }} renderDropdownIcon={() => {
                        return (
                            <IconMCI style={{
                                color: isDarkMode ? Colors.white : Colors.black
                            }}
                                name='chevron-down'
                                size={24}
                            />
                        )
                    }} dropdownIconPosition='right' dropdownStyle={{
                        borderRadius: 10
                    }}
                    data={foodTimeList}
                    defaultButtonText='Select Time'
                    onSelect={(selectedItem, index) => {
                        setFoodTime(selectedItem);
                    }}
                />

                <TouchableOpacity onPress={() => {
                    addToFoodProgram();
                }} style={{
                    backgroundColor: mainColor,
                    width: '45%',
                    marginLeft: '10%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10
                }}>
                    <Text style={{
                        color: Colors.white,
                        fontWeight: 'bold'
                    }}>
                        {
                            isFoodInProgram ?
                                moment().locale() == "tr" ?
                                    "Programdan Kaldır" : "Remove From Program"
                                :
                                moment().locale() == "tr" ?
                                    "Programa Ekle" : "Add to Program"
                        }
                    </Text>
                </TouchableOpacity>

            </View>

        </SafeAreaView>
    )
}

export default FoodDetails