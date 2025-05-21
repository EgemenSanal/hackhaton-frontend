// HomeScreen.js
import React from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';

export default function HomeScreen({ navigation, items, setItems }) {
    const pickImageAndUpload = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('İzin Gerekli', 'Kamera izni verilmedi.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const image = result.assets[0];

            const formData = new FormData();
            formData.append('image', {
                uri: image.uri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            });

            try {
                const response = await fetch('http://192.168.1.48:500/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                });

                const data = await response.json();
                const predictedClass = data?.predicted_class || 'Bilinmiyor';

                const newItem = {
                    id: uuid.v4().toString(),
                    imageUri: image.uri,
                    status: predictedClass,
                };

                setItems((prev) => [newItem, ...prev]);
                Alert.alert('Başarılı', `Durum: ${predictedClass}`);
            } catch (error) {
                console.error(error);
                Alert.alert('Hata', 'Yükleme sırasında hata oluştu.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Kamera ile Tek Çekim" onPress={pickImageAndUpload} />
            <View style={styles.spacer} />
            <Button
                title="Ürünleri Gör"
                onPress={() => navigation.navigate('Products')}
            />
            <View style={styles.spacer} />
            <Button
                title="Otomatik Kamera"
                onPress={() => navigation.navigate('AutoCamera')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    spacer: {
        height: 20,
    },
});
