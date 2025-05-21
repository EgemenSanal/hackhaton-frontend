import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export default function SummaryScreen({ navigation }) {
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const response = await fetch('http://192.168.1.48:5050/llama_summary', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            setSummaryData(data);
        } catch (error) {
            console.error('Summary fetch error:', error);
            Alert.alert('Hata', 'Özet bilgisi alınırken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const formatSummary = (text) => {
        return text
            .replace(/\*\*(.*?)\*\*/g, '$1') // **bold** işaretlemelerini kaldır
            .split('\n') // Satırları ayır
            .map(line => line.trim()) // Boşlukları temizle
            .filter(line => line.length > 0); // Boş satırları çıkar
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Analiz raporu yükleniyor...</Text>
            </View>
        );
    }

    if (!summaryData || !summaryData.summary) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>Analiz raporu bulunamadı</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchSummary}>
                    <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const formattedParagraphs = formatSummary(summaryData.summary);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>← Geri</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>🤖 AI Analiz Raporu</Text>
                <View style={styles.headerSpace} />
            </View>

            <View style={styles.summaryCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>Analiz Sonuçları</Text>
                    {summaryData.result_count && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{summaryData.result_count} sonuç</Text>
                        </View>
                    )}
                </View>

                <ScrollView
                    style={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    {formattedParagraphs.map((line, index) => (
                        <View key={index} style={styles.paragraphContainer}>
                            <Text style={styles.paragraphText}>{line}</Text>
                        </View>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={fetchSummary}
                >
                    <Text style={styles.refreshButtonText}>🔄 Yenile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    errorIcon: {
        fontSize: 48,
        marginBottom: 15,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    headerSpace: {
        width: 60,
    },
    summaryCard: {
        flex: 1,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    countBadge: {
        backgroundColor: '#e3f2fd',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        fontSize: 12,
        color: '#1976d2',
        fontWeight: '600',
    },
    scrollContent: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
    },
    paragraphContainer: {
        marginBottom: 15,
        paddingLeft: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#007AFF',
    },
    paragraphText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#333',
        textAlign: 'justify',
    },
    refreshButton: {
        margin: 20,
        backgroundColor: '#f8f9fa',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    refreshButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
});
