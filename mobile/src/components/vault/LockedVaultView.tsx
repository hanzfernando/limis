import React from 'react'
import { View, Text } from 'react-native'

const LockedVaultView = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg text-[--muted-foreground]">This vault is locked.</Text>
    </View>
  )
}

export default LockedVaultView