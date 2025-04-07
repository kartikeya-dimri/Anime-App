import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import { icons } from '@/constants/icons';

interface Anime {
  mal_id: number;
  title: string;
  title_english: string | null;
  score: number;
  episodes: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

const { width } = Dimensions.get('window');

const AnimeCard = ({ anime }: { anime: Anime }) => {
  const router = useRouter(); // Initialize router

  return (
    <TouchableOpacity
      className="bg-dark-100 rounded-xl mr-4 w-[180px] overflow-hidden shadow-lg mb-10"
      onPress={() => router.push(`/anime/${anime.mal_id}`)} // Navigate on press
    >
      <View className="bg-gray-900 rounded-xl overflow-hidden">
        {/* Anime Image */}
        <Image 
          source={{ uri: anime.images.jpg.image_url }} 
          style={{ 
            width: 190, // match parent width
            height: 248, // appropriate aspect ratio for anime covers
            resizeMode: 'cover'
          }} 
        />

        {/* Anime Name with Wrapping */}
        <View className="p-2">
          <Text 
            numberOfLines={2}
            ellipsizeMode="tail"
            className="text-white text-base font-semibold"
            style={{ width: 160, height: 42 }} 
          >
            {anime.title_english ? anime.title_english : anime.title}
          </Text>
        </View>

        {/* Score & Episodes */}
        <View className="flex-row justify-between p-2 bg-gray-800">
          <View className='flex-row items-center'>
          <Text className="text-white text-md"> {anime.score} </Text>
          <Image source={icons.star} className='size-5'/>
          </View>
          <Text className="text-white text-md">{anime.episodes ? `Ep. ${anime.episodes} ` : "Ongoing "}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AnimeCard;
