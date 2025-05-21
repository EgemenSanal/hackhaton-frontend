// ProductsScreen.js
import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

export default function ProductsScreen({ items }) {
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <Text style={styles.status}>Durum: {item.status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>📦 Ürünler</Text>
            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        padding: 16,
        backgroundColor: '#fff',
    },
    list: {
        paddingHorizontal: 16,
    },
    card: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 8,
    },
    status: {
        fontSize: 16,
        fontWeight: '500',
    },
});
