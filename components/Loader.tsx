import { View, ActivityIndicator, Text } from 'react-native';

const Loader = () => (
  <View className='flex-1 items-center justify-center mt-4'>
    <ActivityIndicator size="large" color="#ffffff" />
    <Text className='text-white text-lg font-bold mt-4'>Loading...</Text>
  </View>
);

export default Loader;
