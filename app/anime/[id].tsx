import { Text, View, TouchableOpacity, Image, ScrollView} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import Loader from '@/components/Loader';
// For Trailer
import React from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { icons } from '@/constants/icons';

interface AnimeInfoProps {
  title : string,
  info? : string | null,
};

const AnimeInfo = ({title, info} : AnimeInfoProps) => {
  return (
  <View className='flex-col items-start justify-center mt-5 px-1'>
    <Text className='text-light-200 font-normal text-sm'>{title}</Text>
    <Text className="text-light-100 font-semibold text-sm mt-2">{info || "NA"}</Text>
  </View>
  )
};

// This is a dynamic route screen
const Details = () => {
  // We can get the id from the route params
  const { id } = useLocalSearchParams();
  console.log(`${id}`);
  const [animeDetails, setAnimeDetails] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);

  interface Genre {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }

  interface Producer {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }

  interface Anime {
    mal_id: number;
    title: string | null;
    title_english: string | null;
    title_japanese: string | null;
    score: number;
    episodes: string;
    images: {
      jpg: {
        image_url: string;
        large_image_url: string;
      };
    };
    trailer: {
        youtube_id: string;
    };
    aired: {
      string : string;
    };
    status : string;
    duration : string;
    scored_by : string,
    type : string;
    rank : string;
    synopsis : string;
    genres : Genre[];
    producers : Producer[];
    rating : string;
    season : string;
    year : string;
    // Add other fields as needed based on the API response
  }


  // Fetch anime details based on the id
  const fetchAnimeDetails = async () => {
    // Fetch anime details based on the id
    console.log(`Inside fetch : ${id}`);
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
      const data = await response.json();
      // console.log(data);
      setAnimeDetails(data.data);
      console.log(data.data.trailer.youtube_id);
    } catch (error) {
      console.error("Error fetching anime details:", error);
    } finally {
      setLoading(false);
    }
    
  };

  useEffect(() => {
      fetchAnimeDetails();
    }, [id]);

  return (
    <View className='bg-primary flex-1'>
        <ScrollView 
          contentContainerStyle={{paddingBottom: 140}}
          showsVerticalScrollIndicator={false}
        >
          {loading || !animeDetails ? (
            <View className='flex-1 items-center justify-center h-screen'>
              <Loader />
            </View>
          ) : (
            <View>
              {animeDetails.trailer.youtube_id ? (
                // render trailer
                <View className="w-full aspect-video mt-8 overflow-hidden">
                  <YoutubePlayer
                    height={300}
                    play={playing}
                    videoId={animeDetails.trailer.youtube_id}
                    onChangeState={(state) => {
                      if (state === "ended") setPlaying(false);
                    }}
                  />
                </View>
              ) : (
                // render poster
                <View>
                  <Image 
                    source={{ uri: animeDetails.images.jpg.large_image_url }} 
                    className="w-full h-[400px]" 
                    resizeMode="stretch"
                  />
                </View>
              )}

              <View className='flex-col items-start justify-center mt-5 px-5'>
                  <Text className='text-white font-bold text-xl'>{animeDetails.title_english}</Text>

                  <View className='flex-row items-center gap-x-2 mt-2'>
                      <Text className='text-md text-light-200 font-bold'>{animeDetails.status}</Text>
                      <Text className='text-md text-light-200 font-bold'>|</Text>
                      <Text className='text-md text-light-200 font-bold'>{(animeDetails.duration).split(" ")[0] + " " + (animeDetails.duration).split(" ")[1]}</Text>
                      <Text className='text-md text-light-200 font-bold'>|</Text>
                      <Text className='text-md text-light-200 font-bold'>{animeDetails.type}</Text>
                      <Text className='text-md text-light-200 font-bold'>|</Text>
                      <Text className='text-md text-light-200 font-bold'>{animeDetails.episodes ? `Ep. ${animeDetails.episodes}` : "Ongoing"}</Text>
                  </View>

                  <View className='flex-row items-center gap-x-3'>
                    <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-3'>
                        <Image source={icons.star} className='size-5'/>
                        <Text className='text-white font-bold text-lg'>{animeDetails.score}/10</Text>
                        <Text className='text-light-200 text-sm'> ({animeDetails.scored_by}) votes</Text>
                    </View>

                    <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-3'>
                        <Image source={icons.trophy} className='size-5'/>
                        <Text className='text-white font-bold text-lg'>{animeDetails.rank} Rank</Text>
                    </View>
                  </View>

                  <AnimeInfo title='Overview' info={animeDetails.synopsis.slice(0,-26)}/>
                  <AnimeInfo title='Genres' info={animeDetails.genres.map((g) => g.name).join(' - ') || "N/A"}/>

                  <View className='flex flex-row justify-between w-1/2 gap-x-8'>
                    <AnimeInfo title='Premiered' info={animeDetails.season + " " + animeDetails.year}/>
                    <AnimeInfo title='Aired' info={animeDetails.aired.string}/>
                  </View>

                  <AnimeInfo title='Producers' info={animeDetails.producers.map((p) => p.name).join(' - ') || "N/A"}/>
              </View>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity className='absolute bottom-20 left-0 right-0 mx-5 bg-accent
         rounded-lg py-3.5 flex flex-row items-center justify-center z-50'
         onPress={router.back}>
            <Image 
              source={icons.arrow}
              className='size-5 mr-1 mt-0.5 rotate-180'
              tintColor='#fff' 
            />
            <Text className='text-white font-semibold text-base'>Go back</Text>
        </TouchableOpacity>
    </View>
  )
}

export default Details

