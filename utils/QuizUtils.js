import AsyncStorage from "@react-native-async-storage/async-storage"
import { component_main } from "./strings"

const GUESS_COMPOSER_APP_STORAGE_KEY = "GuessTheComposerApp:PreferenceManager"
const CURRENT_SCORE_KEY = "current_score"
const HIGH_SCORE_KEY = "high_score"
export const GAME_FINISHED = "game_finished"
const NUM_ANSWERS = 4


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
}
  

/**
* Generates an ArrayList of Integers that contains IDs to NUM_ANSWERS samples. These samples
* constitute the possible answers to the question.
* @param remainingSampleIDs The ArrayList of Integers which contains the IDs of all
*                           samples that haven't been used yet.
 @return The ArrayList of possible answers.
*/
export function generateQuestion(remainingSampleIDs){

    // Shuffle the remaining sample ID's.
    const shuffeldCollections = shuffleArray(remainingSampleIDs)

    const answers = []

    // Pick the first four random Sample ID's.
    for(let i = 0; i < NUM_ANSWERS; i++){
        if(i < shuffeldCollections.length) {
            answers.push(shuffeldCollections[i])
        }
    }

    return answers
}

async function getSharedPreferences(prefKey, defaultValue){
    const prefs = await AsyncStorage.getItem(GUESS_COMPOSER_APP_STORAGE_KEY)

    if(!prefs)
        return defaultValue //early return

    return JSON.parse(prefs)[prefKey] ? JSON.parse(prefs)[prefKey] : defaultValue
}


/**
 * Helper method for getting the user's high score.
 * @return The user's high score.
 */
export async function getHighScore(){
    return await getSharedPreferences(HIGH_SCORE_KEY, 0)
}

/**
 * Helper method for setting the user's high score.
 * @param highScore The user's high score.
 */
export function setHighScore(highScore){
    return AsyncStorage.mergeItem(GUESS_COMPOSER_APP_STORAGE_KEY, JSON.stringify({
        [HIGH_SCORE_KEY]: highScore
    }))
}

/**
 * Helper method for getting the user's current score.
 * @return The user's current score.
 */
export async function getCurrentScore(){
    return await getSharedPreferences(CURRENT_SCORE_KEY, 0)
}

/**
 * Helper method for setting the user's current score.
 * @param currentScore The user's current score.
 */
export function setCurrentScore(currentScore){
    return AsyncStorage.mergeItem(GUESS_COMPOSER_APP_STORAGE_KEY, JSON.stringify({
        [CURRENT_SCORE_KEY]: currentScore
    }))
}

/**
 * Picks one of the possible answers to be the correct one at random.
 * @param answers The possible answers to the question.
 * @return The correct answer.
 */
export function getCorrectAnswerID(answers){
    if (answers && answers.length) {
        return answers[Math.floor(Math.random() * answers.length)];
    }
    // The undefined will be returned if the empty array was passed
}

/**
* Checks that the user's selected answer is the correct one.
* @param correctAnswer The correct answer.
* @param userAnswer The user's answer
* @return true if the user is correct, false otherwise.
*/
export function userCorrect(correctAnswer, userAnswer){
    return userAnswer.id === correctAnswer.id
}

/**
* Helper method for ending the game.
*/
export const endGame = (navigation) => {
    navigation.navigate(component_main, { 
        [GAME_FINISHED]: true
    })
}

export function getComposerArtBySampleID(sampleID) {
    switch (sampleID){
        case 0:
            return require("../assets/images/bach.jpg")
        case 1:
            return require("../assets/images/beethoven.jpg")
        case 2:
            return require("../assets/images/brahms.jpg")
        case 3:
            return require("../assets/images/chopin.jpg")
        case 4:
            return require("../assets/images/debussy.jpg")
        case 5:
            return require("../assets/images/mozart.jpg")
        case 6:
            return require("../assets/images/pachelbel.jpg")
        case 7:
            return require("../assets/images/schubert.jpg")
        case 8:
            return require("../assets/images/tchaikovsky.jpg")
        case 9:
            return require("../assets/images/vivaldi.jpg")
        case 10:
            return require("../assets/images/wagner.jpg")
    }
}