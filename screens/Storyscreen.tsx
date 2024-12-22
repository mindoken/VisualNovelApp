import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import images, { ImageKeys } from '../assets/data_for_novel/imageImports';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

interface Scene {
  image: ImageKeys;
  text: string;
  options: Array<{
    text: string;
    nextIndex: number;
  }>;
}

interface StoryData {
  scenes: Scene[];
}

type StoryScreenProps = NativeStackScreenProps<any, 'Story'>;

const StoryScreen: React.FC<StoryScreenProps> = ({ navigation }) => {
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://raw.githubusercontent.com/mindoken/data_for_novel/main/data_for_novel/data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStoryData(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedIndex = await AsyncStorage.getItem('currentSceneIndex');
        if (savedIndex !== null) {
          setCurrentIndex(parseInt(savedIndex, 10));
        }
      } catch (error) {
        console.error('Ошибка при загрузке прогресса:', error);
      }
    };

    loadProgress();
  }, []);

  const saveProgress = async (index) => {
    try {
      await AsyncStorage.setItem('currentSceneIndex', index.toString());
    } catch (error) {
      console.error('Ошибка при сохранении прогресса:', error);
    }
  };

  const handleOptionSelect = (nextIndex) => {
    setCurrentIndex(nextIndex);
    saveProgress(nextIndex);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!storyData || !storyData.scenes || storyData.scenes.length === 0) {
    return <Text>Ошибка: сцены не найдены.</Text>;
  }

  const currentScene = storyData.scenes[currentIndex];

  if (!currentScene) {
    return <Text>Ошибка: сцена не найдена.</Text>;
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 500,
      height: 600,
    },
  });

  const imageSource = { uri: images[currentScene.image] };
  const isLastScene = currentIndex === storyData.scenes.length - 1;

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <Text style={{ fontSize: 24, textAlign: 'center', marginVertical: 20 }}>{currentScene.text}</Text>
      {isLastScene ? (
        <Button title="Вернуться на главный экран" onPress={() => navigation.navigate('Home')} />
      ) : (
        currentScene.options.map((option, index) => (
          <Button key={index} title={option.text} onPress={() => handleOptionSelect(option.nextIndex)} />
        ))
      )}
    </View>
  );
};

export default StoryScreen;
