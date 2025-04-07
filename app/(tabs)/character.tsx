import { View, Image, ScrollView, Text } from 'react-native'
import React from 'react'
import { images } from '@/constants/images'

const Character = () => {
  return (
    <View className='flex-1 bg-primary'>
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
        </View>

      </ScrollView>
    </View>
  )
}

export default Character