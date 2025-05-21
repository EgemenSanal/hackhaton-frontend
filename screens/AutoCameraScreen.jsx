// AutoCameraScreen.jsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, Camera } from 'expo-camera'; // CameraView kullanıyoruz
import uuid from 'react-native-uuid';

export default function AutoCameraScreen({ navigation, items, setItems }) {
    const cameraRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        if (hasPermission && isCameraReady) {
            startCaptureLoop();
        }
    }, [hasPermission, isCameraReady]);

    const analyzeImage = async (photoUri, itemId) => {
        try {
            const formData = new FormData();
            formData.append('image', {
                uri: photoUri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            });

            const response = await fetch('http://192.168.1.48:500/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();
            const predictedClass = data?.predicted_class || 'Bilinmiyor';

            // Backend'den dönen cevapla item'ı güncelle
            setItems((prev) =>
                prev.map(item =>
                    item.id === itemId
                        ? { ...item, status: predictedClass }
                        : item
                )
            );
        } catch (err) {
            console.error('Backend analiz hatası:', err);
            // Hata durumunda status'u güncelle
            setItems((prev) =>
                prev.map(item =>
                    item.id === itemId
                        ? { ...item, status: 'Analiz Hatası' }
                        : item
                )
            );
        }
    };

    const startCaptureLoop = async () => {
        while (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.5 });

                // Hemen geçici bir item oluştur ve listeye ekle
                const newItemId = uuid.v4().toString();
                const newItem = {
                    id: newItemId,
                    imageUri: photo.uri,
                    status: 'Analiz Ediliyor...', // Geçici durum
                };

                setItems((prev) => [newItem, ...prev]);

                // Backend analizini asenkron olarak başlat (await kullanmadan)
                analyzeImage(photo.uri, newItemId);

                // Bir sonraki fotoğraf için kısa bekleme
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (err) {
                console.error('Fotoğraf çekim hatası:', err);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    };

    if (hasPermission === null) {
        return <View><Text>İzin kontrol ediliyor...</Text></View>;
    }

    if (hasPermission === false) {
        return <View><Text>Kamera izni verilmedi.</Text></View>;
    }

    return (
        <View style={styles.container}>
            <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="back" // CameraType.back yerine "back" kullanıyoruz
                onCameraReady={() => setIsCameraReady(true)}
            />
            <View style={styles.overlay}>
                <Text style={styles.overlayText}>Kamera otomatik modda çalışıyor...</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 10,
        borderRadius: 10,
    },
    overlayText: {
        color: '#fff',
        fontSize: 16,
    },
});