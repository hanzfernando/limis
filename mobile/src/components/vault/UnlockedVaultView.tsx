import React from 'react'
import { View, Text } from 'react-native'


const UnlockedVaultView = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg text-[--muted-foreground]">This vault is unlocked.</Text>
    </View> 
  )
}

export default UnlockedVaultView