import { StatusBar } from 'expo-status-bar'
import { Text, View } from 'react-native'

// O layout mobile não usa pixel, usa DP (Densidade de Pixel) que é uma forma de aplicar um tamanho
// padrão para todos os layouts mobiles

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-950">
      <Text className="text-5xl font-bold text-gray-50">NLW Spacetime</Text>
      <StatusBar style="light" translucent />
    </View>
  )
}
