import { View, Image, ScrollView, Dimensions, Text } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'
import { useState, useEffect } from 'react'
import Loader from '@/components/Loader';
import AnimeCard from '@/components/AnimeCard'

const { width } = Dimensions.get('window');


const index = () => {
  
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
    // Add other fields as needed based on the API response
  }

  const [topAiring, setTopAiring] = useState<Anime[]>([]);
  const [topPopular, setTopPopular] = useState<Anime[]>([]);
  const [loadingAiring, setLoadingAiring] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);

  const fetchTopAiring = async () => {
    setLoadingAiring(true);
    try {
      const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing&limit=20');
      const data  = await response.json();
       // Filter out duplicate mal_id
       const uniqueAnime = Array.from(new Map((data.data as Anime[]).map((anime) => [anime.mal_id, anime])).values());
       setTopAiring(uniqueAnime);
    } catch (error) {
      console.error("Error fetching top airing anime:", error);
    } finally {
      setLoadingAiring(false);
    }
  };

  const fetchTopPopular = async () => {
    setLoadingPopular(true);
    try {
      // Fetching anime sorted by popularity
      const response = await fetch('https://api.jikan.moe/v4/top/anime?type=tv&limit=20&order_by=popularity');
      const data  = await response.json();
      setTopPopular(data.data);
    } catch (error) {
      console.error("Error fetching top popular anime:", error);
    } finally {
      setLoadingPopular(false);
    }
  };

  
  // const AnimeCard = ({ anime }: { anime: Anime }) => (
  //   <View className="bg-gray-900 rounded-xl overflow-hidden mx-2">
  //     {/* Anime Image */}
  //     <Image source={{ uri: anime.images.jpg.image_url }} style={{ width: width * 0.6, height: width * 0.9 }} />
  
  //     {/* Score & Episodes */}
  //     <View className="flex-row justify-between p-2 bg-gray-800">
  //       <Text className="text-white text-sm">⭐ {anime.score}</Text>
  //       <Text className="text-white text-sm">{anime.episodes ? `Ep. ${anime.episodes}` : "Ongoing"}</Text>
  //     </View>
  //   </View>
  // );

  useEffect(() => {
    fetchTopAiring();
    fetchTopPopular();
  }, []);

return (
  <View className='flex-1 bg-primary'>
      {/* Background Image */}
      <Image source={images.bg} className='absolute w-full z-0'/>

      <ScrollView
        className='flex-1 px-5 mb-10'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: '100%', paddingBottom: 100 }}
      >
          {/* Logo */}
          <Image source={require('@/assets/images/fire-kanji.png')}
           className='w-12 h-10 mt-20 mb-2 mx-auto' />

          {/* App Title */}
          <View className="mb-4">
              <Text className="text-4xl text-white text-center font-bold">Dattebayo</Text>
              <Text className="text-3xl text-orange-400 text-center font-bold mt-1">だってばよ</Text>
              <Text className="text-lg text-gray-300 text-center mt-5 px-4 font-bold">
                  Explore your favourite anime and characters
              </Text>
          </View>

          {/* Poster collage */}
          <Image 
              source={images.posterCollage} 
              className='mt-6 mb-16 mx-auto rounded-xl'
              style={{
                  width: width * 0.80,
                  height: width * 0.80 * 0.8,
                  resizeMode: 'contain'
              }}
          />
          
          {/* 🔥 Top Airing Anime */}
          <View className='mt-5'>
            <Text className="text-white text-xl font-bold mb-3">🔥 Top Airing Anime</Text>
            {loadingAiring ? (
              <Loader />
            ) : (
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                className="py-2"
              >
                <View className='flex-row gap-x-5'>
                {topAiring.map((anime, index) => (
                  <AnimeCard key={index.toString()} anime={anime} />
                ))}
                </View>
              </ScrollView>
            )}
          </View>

          {/* 🔥 Most Popular Anime */}
          <View className='mt-5'>
            <Text className="text-white text-xl font-bold mb-3">🥇 Most Popular Anime</Text>
            {loadingPopular ? (
              <Loader />
            ) : (
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                className="py-2"
              >
                <View className='flex-row gap-x-5'>
                  {topPopular.map((anime, index) => (
                    <AnimeCard key={index.toString()} anime={anime} />
                  ))}
                </View>
              </ScrollView>
            )}
          </View>

      </ScrollView>
  </View>
)
}

export default index



