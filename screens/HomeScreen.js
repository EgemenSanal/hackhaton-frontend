// HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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

    const getAISummary = async () => {
        try {
            const response = await fetch('http://192.168.1.48:500/llama_summary', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            const summary = data?.summary || 'Özet bilgisi alınamadı.';

            Alert.alert('Yapay Zeka Özeti', summary);
        } catch (error) {
            console.error('Summary fetch error:', error);
            Alert.alert('Hata', 'Özet bilgisi alınırken hata oluştu.');
        }
    };

    const menuItems = [
        {
            title: 'Ürünleri Gör',
            subtitle: 'Kayıtlı ürünlerinizi görüntüleyin',
            icon: 'grid-outline',
            onPress: () => navigation.navigate('Products'),
            gradient: ['#667eea', '#764ba2']
        },
        {
            title: 'Görsel Analiz',
            subtitle: 'Kamera ile ürün analizi yapın',
            icon: 'camera-outline',
            onPress: () => navigation.navigate('AutoCamera'),
            gradient: ['#f093fb', '#f5576c']
        },
        {
            title: 'Yapay Zeka Analizi',
            subtitle: 'AI destekli özet ve analiz',
            icon: 'brain-outline',
            onPress: () => navigation.navigate('Summary'),
            gradient: ['#4facfe', '#00f2fe']
        }
    ];

    const MenuButton = ({ item }) => (
        <TouchableOpacity
            style={styles.menuButton}
            onPress={item.onPress}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={item.gradient}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.buttonContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={item.icon} size={32} color="white" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.buttonTitle}>{item.title}</Text>
                        <Text style={styles.buttonSubtitle}>{item.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
            <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                style={styles.container}
            >
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <Text style={styles.welcomeText}>Hoş Geldiniz</Text>
                        <Text style={styles.headerTitle}>Akıllı Analiz Merkezi</Text>
                    </View>

                    <View style={styles.menuContainer}>
                        {menuItems.map((item, index) => (
                            <MenuButton key={index} item={item} />
                        ))}
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{items?.length || 0}</Text>
                                <Text style={styles.statLabel}>Toplam Analiz</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>AI</Text>
                                <Text style={styles.statLabel}>Destekli</Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        paddingTop: 40,
        paddingBottom: 30,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    menuContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 20,
    },
    menuButton: {
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonGradient: {
        paddingVertical: 24,
        paddingHorizontal: 20,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    buttonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    buttonSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    footer: {
        paddingVertical: 30,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 15,
        paddingVertical: 20,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginHorizontal: 20,
    },
});