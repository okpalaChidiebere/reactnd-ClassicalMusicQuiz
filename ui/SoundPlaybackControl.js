import React from "react"
import { Text, View, StyleSheet, Pressable }  from "react-native"
import { AntDesign } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"
import moment from "moment"

export default function SoundPlaybackControl({ onSoundPlay, status, onPrevious, onSeek }){
    return (
        <View style={styles.container}>
            <View style={{flex: 1, flexDirection:"row", justifyContent:"space-evenly", alignItems:"center"}}>
                <Pressable onPress={onPrevious}>
                    <AntDesign name="stepbackward" size={19} color="white" />
                </Pressable>
                <Pressable onPress={onSoundPlay}>
                {
                    (status.isPlaying && status.isLoaded)
                    ? <AntDesign name="pause" size={19} color="white" />
                    : <AntDesign name="caretright" size={19} color="white" />
                }
                </Pressable>
            </View>
            <View style={{flex: 1, flexDirection:"row", justifyContent:"space-around", alignItems:"center"}}>
                <Text style={styles.text}>{moment.utc(status.positionMillis).format("mm:ss")}</Text>
                <Slider
                    style={{width: "80%", height: 40}}
                    maximumValue={status.durationMillis}
                    value={status.positionMillis}
                    onValueChange={onSeek}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="#000000"
                    thumbStyle={styles.thumb}
                    trackStyle={styles.track}
                />
                <Text style={styles.text}>{moment.utc(status.durationMillis).format("mm:ss")}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        position: "absolute",
        bottom: 0,
        height: 100,
        width:"100%",
        backgroundColor:"rgba(13, 13, 13, 0.8)",
        flexDirection:"column",
    },
    track: {
      height: 2,
      borderRadius: 1,
    },
    thumb: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    text: {
    color:"#fff",
      fontSize: 12,
      textAlign: 'center',
    }
})