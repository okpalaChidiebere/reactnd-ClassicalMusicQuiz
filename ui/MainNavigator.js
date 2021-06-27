import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import MainComponent from "./MainComponent"
import QuizComponent from "./QuizComponent"
import { component_main, component_quizz } from "../utils/strings"

const Stack = createStackNavigator()
const MainNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator 
    headerMode="screen" 
    initialRouteName={component_main} 
    screenOptions={{ 
        title: "Guess the Composer!",
        headerTintColor: '#fff',
        headerStyle: { 
            backgroundColor: "#3F51B5",
        },
    }}>
        <Stack.Screen
          name={component_main}
          component={MainComponent}
        />
        <Stack.Screen
          name={component_quizz}
          component={QuizComponent}
        />
    </Stack.Navigator>
  </NavigationContainer>
)

export default MainNavigator