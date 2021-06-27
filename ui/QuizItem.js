import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet, Image, ActivityIndicator, Pressable }  from "react-native"
import { getComposerArtBySampleID } from "../utils/QuizUtils"

const CORRECT_ANSWER_DELAY_MILLIS = 1000 //one second delay

export default function QuizItem({ mQuestionSampleIDs = null, mAnswerSampleID = null, handleOnCLick }) {

    const [ state, setState] = useState({
        questionSampleIDs: null,
        answerSampleID: null,
    })

    useEffect(() => {
        setState({
            questionSampleIDs: mQuestionSampleIDs,
            answerSampleID: mAnswerSampleID,
        })
    }, [mQuestionSampleIDs, mAnswerSampleID])

    const handleOnPress = (buttonIndex) => {
        const { questionSampleIDs, answerSampleID } = state
        
        /**
         * Show the correct answer.
         * 
         * Disables the buttons and changes the background colors to show the correct answer.
         * The new color filed added will be used to know when to diable the buttons and reflect 
         * the correct answer on the button as well
         */
        const updatedQuestionSampleIDs = questionSampleIDs.map(qs => ({ ...qs, color: qs.id === answerSampleID.id ? "#bbff33" : "#ff6666" }))
        setState(currState => ({
          ...currState,
          questionSampleIDs: updatedQuestionSampleIDs, 
        }))

        // Wait some time so the user can see the correct answer, then go to the next question.
        setTimeout(() => handleOnCLick(buttonIndex), CORRECT_ANSWER_DELAY_MILLIS)

    }

    const { questionSampleIDs, answerSampleID } = state

    if(!answerSampleID || !questionSampleIDs){
        return <View style={{flex: 1, justifyContent: "center", alignItems:"center"}}><ActivityIndicator style={{marginTop: 30}} size="large" color="#d9d9d9"/></View>
    }

    return (
        <View style={styles.container}>
            <View style={{
            flex: 1, justifyContent:"center", alignItems:"center"}}>
                <Image 
                style={{width:"100%", height:"100%", resizeMode:"contain"}}
                source={// Load the image of the composer for the answer into the ImageView.
                    getComposerArtBySampleID(answerSampleID.id)}
                />
            </View>
            <View style={{flex: 1, flexWrap: "wrap", flexDirection:"row", justifyContent:"space-evenly"}}>
                {// Initialize the buttons with the composers names and also set the onPres listener for the buttons
                questionSampleIDs.map(({ composer, id, color }) => (
                    <Pressable 
                    onPress={() => handleOnPress(id)} 
                    key={id} 
                    disabled={/*Disables the buttons one an answer is selected*/color?true:false}
                    >
                        <View style={[styles.button, { backgroundColor: color? color: "#cccccc" }]}>
                            <Text>{composer.toUpperCase()}</Text>
                        </View>
                    </Pressable>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection:"column",
      backgroundColor: '#ffff',
    },
    button: {
        justifyContent:"center",
        alignItems:"center",
        width: 200, 
        height: 185, 
        margin: 2
    }
})
