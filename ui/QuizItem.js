import React, { useEffect, useState } from "react"
import { Text, View, StyleSheet, Image, ActivityIndicator, Pressable }  from "react-native"
import { Audio } from "expo-av"
import { getComposerArtBySampleID } from "../utils/QuizUtils"

const TAG = "QuizItem"
const CORRECT_ANSWER_DELAY_MILLIS = 1000 //one second delay

export default function QuizItem({ mQuestionSampleIDs = null, mAnswerSampleID = null, handleOnCLick, navigation }) {

    const [ state, setState] = useState({
        questionSampleIDs: null,
        answerSampleID: null,
        imageSource: undefined,
    })

    const [sound, setSound] = useState();

    useEffect(() => {
        //Create an Audio Sound instance
        mAnswerSampleID && initializeSound(mAnswerSampleID.uri)
        setState({
            questionSampleIDs: mQuestionSampleIDs,
            answerSampleID: mAnswerSampleID,
        })

    }, [mQuestionSampleIDs, mAnswerSampleID])

    /**
     * Release the sound from memory when the component is destroyed
     */
    useEffect(() => {
        return sound
        ? () => {
            sound.unloadAsync() }
        : undefined
    }, [sound])

    /**
     * Initialize Expo Audio player.
     * @param mediaSource The URI of the sample to play.
     */
    async function initializeSound(mediaSource){
        Audio.setAudioModeAsync(
            {
                /** 
                 * For this project, We want to keep the music playing so that the user can check their text message.
                 * However, we do run the risk of the component being destroyed by the system and 
                 * therefore unexpectedly terminating playback
                */
                staysActiveInBackground: true, //this alone is good for android
                playsInSilentModeIOS: true, //you must set this to ture, if you want the sound to still play when your app goes to the background
            }
        )
        const initialStatus = {
            shouldPlay: true, //the sound begins playing immediately when its ready
            isLooping: true,
        }

        const onPlaybackStatusUpdate = async (playbackStatus) => {
            /**
            * see full list of status you can listen for here 
            * https://docs.expo.io/versions/v41.0.0/sdk/av/#playback-status */
            if(playbackStatus.isPlaying && playbackStatus.isLoaded){
                console.log(TAG, "onPlayerStatusChanged: PLAYING")
            } else if(!playbackStatus.isPlaying){
                console.log(TAG, "onPlayerStatusChanged: PAUSED")
            }
        }

        //prepare the sound
        const { sound } = await Audio.Sound.createAsync(
            mediaSource,
            initialStatus,
            onPlaybackStatusUpdate,
        );

        setSound(sound)
    }

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
          imageSource: getComposerArtBySampleID(answerSampleID.id) // show the potrait of the composer in the Album art now the user has selcted an aser to help show what the correct answer is
        }))

        // Wait some time so the user can see the correct answer, then go to the next question.
        setTimeout(() => handleOnCLick(buttonIndex), CORRECT_ANSWER_DELAY_MILLIS)

    }

    const { questionSampleIDs, answerSampleID, 
        // Load the question mark as the background image until the user answers the question.
        imageSource = require("../assets/images/question_mark.png")
    } = state

    if(!answerSampleID || !questionSampleIDs){
        return <View style={{flex: 1, justifyContent: "center", alignItems:"center"}}><ActivityIndicator style={{marginTop: 30}} size="large" color="#d9d9d9"/></View>
    }

    return (
        <View style={styles.container}>
            <View style={{
            flex: 1, justifyContent:"center", alignItems:"center"}}>
                <Image 
                style={{width:"100%", height:"100%", resizeMode:"contain"}}
                source={imageSource}
                />
            </View>
            <View style={{flex: 1, flexWrap: "wrap", flexDirection:"row", justifyContent:"space-evenly"}}>
                {// Initialize the buttons with the composers names and also set the onPres listener for the buttons
                questionSampleIDs.map(({ composer, id, color }) => (
                    <Pressable 
                    onPress={() => handleOnPress(id)} 
                    key={id} 
                    disabled={/*Disables the buttons once an answer is selected*/color?true:false}
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
