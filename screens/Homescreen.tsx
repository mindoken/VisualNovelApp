import React from 'react';
import { View, Text, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type HomeScreenProps = NativeStackScreenProps<any, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Добро пожаловать в визуальную новеллу!</Text>
      <Button title="Начать" onPress={() => navigation.navigate('Story')} />
    </View>
  );
};

export default HomeScreen;
