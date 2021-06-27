import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet, Button }  from "react-native"
import { useIsFocused } from "@react-navigation/native"
import { component_quizz, high_score, score_result } from "../utils/strings"
import media_exolist from "../assets/media/media_exolist"
import { GAME_FINISHED, getHighScore, getCurrentScore } from "../utils/QuizUtils"

export default function MainComponent({ route, navigation }) {

    const isFocused = useIsFocused()

    const [state, setState] = useState({
        highScore: null,
        yourScore: null,
        maxScore: null,
    })

    useEffect(() => {
        (async () => {
            // Get the high and max score.
            const highScore = await getHighScore()
            const maxScore = media_exolist.length - 1

            const yourScore = await getCurrentScore()

            setState({
                highScore,
                yourScore,
                maxScore,
            })

        })()

        /** anytime this screen is back on focus, we want to update the scores
         * https://reactnavigation.org/docs/navigation-events/
         * https://stackoverflow.com/questions/60182942/useeffect-not-called-in-react-native-when-back-to-screen
         */
    }, [ isFocused ]) 

    const { params = null } = route
    const { highScore, yourScore, maxScore } = state
    return (
        <View style={styles.container}>
            <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{flex: 1, justifyContent:"flex-end", alignItems:"center",}}>
                    { // If the game is over, show the game finished UI.
                        params?.[GAME_FINISHED] && <Text style={{fontSize: 25, marginBottom: 70,}}>Game Finished!</Text>
                    }
                </View>
                <View style={{flex: 1, justifyContent:"center", alignItems:"center",}}>
                    <Button title="NEW GAME" onPress={() => newGame(navigation)} />
                </View>
                <View style={{flex: 1, justifyContent:"space-evenly", alignItems:"center",}}>
                    <Text style={{fontSize: 25}}>{high_score(highScore, maxScore)}</Text>
                    { // If the game is over, show the game finished UI.
                        params?.[GAME_FINISHED] && <Text style={{fontSize: 25}}>{score_result(yourScore, maxScore)}</Text>
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 10,
    },
  })

/**
* The OnClick method for the New Game button that starts a new game.
* @param navigation The React navigation variable.
*/
const newGame = (navigation) => navigation.navigate(component_quizz)

export function MainComponentOptions({ route, navigation }) {

    return {
        title: "Guess the Composer!",
        headerTintColor: '#fff',
        headerStyle: { 
            backgroundColor: "#3F51B5",
        },
    }
}