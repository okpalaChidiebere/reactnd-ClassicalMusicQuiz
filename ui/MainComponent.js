import React from "react"
import { Text, View, StyleSheet }  from "react-native"

export default function MainComponent() {

    return (
        <View style={styles.container}>
            <Text> Starter code </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      padding: 10,
    },
    checkbox: {
        color: "#d9d9d9"
    },
  })

export function MainComponentOptions({ route, navigation }) {

    return {
        title: "Guess the Composer!",
        headerTintColor: '#fff',
        headerStyle: { 
            backgroundColor: "#3F51B5",
        },
    }
}