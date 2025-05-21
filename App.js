// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProductsScreen from './screens/ProductsScreen';
import AutoCameraScreen from './screens/AutoCameraScreen';
import SummaryScreen from './screens/SummaryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [items, setItems] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} items={items} setItems={setItems} />}
        </Stack.Screen>
        <Stack.Screen name="Products">
          {(props) => <ProductsScreen {...props} items={items} />}
        </Stack.Screen>
        <Stack.Screen name="AutoCamera">
          {(props) => <AutoCameraScreen {...props} items={items} setItems={setItems} />}
        </Stack.Screen>
        <Stack.Screen name="Summary">
          {(props) => <SummaryScreen {...props} items={items} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// AnalyzedItem objesi { id, imageUri, status } yapısında olacak
