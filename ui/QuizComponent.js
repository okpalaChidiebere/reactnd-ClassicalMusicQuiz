import React, { useEffect, useState, useRef } from "react"
import { View, StyleSheet }  from "react-native"
import QuizItem from "./QuizItem"
import { userCorrect, setCurrentScore, setHighScore, getCurrentScore, 
    getHighScore, generateQuestion, getCorrectAnswerID, endGame,  } from "../utils/QuizUtils"
import media_exolist from "../assets/media/media_exolist"

export default function QuizComponent({ route, navigation }) {

    const mCurrentScore = useRef(null)
    const mHighScore = useRef(null)

    const [state, setState] = useState({
        mRemainingSampleIDs: [],
        mQuestionSampleIDs: [],
        mAnswerSampleID: null,
    })

    useEffect(() => {
        (async () => {
            // Since it's a new game, set the current score to 0 and load all samples.
            await setCurrentScore(0)

            // Get current and high scores.
            mCurrentScore.current = await getCurrentScore()
            mHighScore.current = await getHighScore()

            const mRemainingSampleIDs = media_exolist

            // Generate a question and get the correct answer.
            const mQuestionSampleIDs = generateQuestion(mRemainingSampleIDs)
            const mAnswerSampleID = getCorrectAnswerID(mQuestionSampleIDs)

            setState({
                mRemainingSampleIDs,
                mQuestionSampleIDs,
                mAnswerSampleID,
            })
        })()
    }, [])

    /**
     * The OnClick method for all of the answer buttons. The method uses the index of the button
     * in button array to to get the ID of the sample from the array of question IDs. It also
     * toggles the UI to show the correct answer.
     *
     * @param buttonIndex The index of the button that was clicked.
     */
    const onClick = (buttonIndex) => {
        const { mRemainingSampleIDs, mQuestionSampleIDs, mAnswerSampleID } = state

        // Get the index of the pressed button
        const userAnswerIndex = buttonIndex;

        // Get the ID of the sample that the user selected.
        const userAnswerSampleID = mQuestionSampleIDs.find(qs => qs.id === userAnswerIndex)

        // If the user is correct, increase there score and update high score.
        if (userCorrect(mAnswerSampleID, userAnswerSampleID)) {
            mCurrentScore.current++
            setCurrentScore(mCurrentScore.current)
            if (mCurrentScore.current > mHighScore.current) {
                mHighScore.current = mCurrentScore.current
                setHighScore(mHighScore.current)
            }
        }

        let remainingSampleIDs = mRemainingSampleIDs
        // Remove the answer sample from the list of all samples, so it doesn't get asked again.
        remainingSampleIDs = remainingSampleIDs.filter(s => s.id != mAnswerSampleID.id)

        // Generate a question and get the correct answer from the remaining songs
        const questionSampleIDs = generateQuestion(remainingSampleIDs)
        const answerSampleID = getCorrectAnswerID(questionSampleIDs)

        // If there is only id left, end the game and display the current and high scores.
        if (remainingSampleIDs.length < 2) {
            endGame(navigation)
            return
        }

        setState({
            mRemainingSampleIDs: remainingSampleIDs,
            mQuestionSampleIDs: questionSampleIDs,
            mAnswerSampleID: answerSampleID,
        })
    }

    const { mQuestionSampleIDs, mAnswerSampleID } = state

    return (
        <View style={styles.container}>
            <QuizItem 
            navigation={navigation}
            mQuestionSampleIDs={mQuestionSampleIDs} 
            mAnswerSampleID={mAnswerSampleID}
            handleOnCLick={onClick}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
})
