import { View, Text, Alert } from 'react-native'
import React, { useState, useEffect, createContext } from 'react'
import moment from 'moment'

import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login: async (email, password, navigation) => {
                    try {
                        await auth().signInWithEmailAndPassword(email, password)
                            .then(async result => {
                                if (!result.user.emailVerified) {
                                    result.user.sendEmailVerification();
                                    Alert.alert(
                                        moment().locale() == "tr" ?
                                            'Mesaj'
                                            :
                                            'Message',
                                        moment().locale() == "tr" ?
                                            'Lütfen Email Adresinize Gelen Maili Onaylayınız.'
                                            :
                                            'Please Confirm the Incoming Mail to Your Email Address.',
                                    );
                                } else {

                                    const reference = await database().ref('/MyDiet/userList/' + result.user.uid);
                                    reference
                                        .update({
                                            OnlineStatus: true,
                                        });

                                }
                            })
                    } catch (error) {
                        Alert.alert(
                            moment().locale() == "tr" &&
                            'Giriş Hatası', error ||
                        'Login Error', error
                        );
                    }
                },

                signup: async (email, password, name, phone, navigation) => {
                    try {
                        await auth().createUserWithEmailAndPassword(email, password)
                            .then(async result => {
                                var uid = result.user.uid;

                                result.user.sendEmailVerification();
                                result.user.updateProfile({
                                    displayName: name,
                                });

                                const reference1 = await database().ref('/MyDiet/userList/' + uid);
                                reference1
                                    .set({
                                        CreatedDate: new Date(),
                                        Email: email,
                                        ImageUrl: "https://firebasestorage.googleapis.com/v0/b/eidos-95e1f.appspot.com/o/Uploads%2FUsers%2Fuserdefault.png?alt=media&token=06397d82-3dc8-4783-b110-a22b5d68e92e",
                                        Name: name,
                                        Password: password,
                                        Age: 0,
                                        MyWeight: 1,
                                        MyHeight: 1,
                                        Uid: result.user.uid,
                                        NotificationCount: 0,
                                        OnlineStatus: false,
                                    });


                                Alert.alert(
                                    moment().locale() == "tr" ?
                                        'Mesaj'
                                        :
                                        'Message',
                                    moment().locale() == "tr" ?
                                        'Üyelik Oluşturuldu. Lütfen Email Adresinize Gelen Maili Onaylayınız.'
                                        :
                                        'Membership Created. Please Confirm the Incoming Mail to Your Email Address.',
                                );
                                navigation.navigate("LoginScreen");
                            });
                    } catch (error) {
                        console.log(error);
                    }
                },
                resetPassword: async (email) => {
                    try {
                        await auth().sendPasswordResetEmail(email);
                        Alert.alert(
                            moment().locale() == "tr" ?
                                'Mesaj'
                                :
                                'Message',
                            moment().locale() == "tr" ?
                                'Şifre Sıfırlama Linki Mail Adresinize Gönderildi.'
                                :
                                'Password Reset Link Has Been Sent To Your Email Address.',
                        );
                    } catch (error) {
                        alert(error);
                    }
                },
                signOut: async () => {
                    try {
                        await auth().signOut();
                    } catch (error) {
                        console.log(error);
                    }
                },
            }}
        >{children}</AuthContext.Provider>
    );
};

