import React, {useState} from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Button, ImageBackground, Image} from 'react-native';
import DatePicker from 'react-native-datepicker';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const Header = ({searchForAsteroids}) =>{

    const [text, setText] = useState(''); 
    const onChangeInput = textValue => setText(textValue)
    const headerBackgroundImage = { uri: "https://cdn.pixabay.com/photo/2021/07/24/17/42/space-6490065_1280.jpg"}
    const nasaLogoImage = {uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/1224px-NASA_logo.svg.png"}

    return (
      <View style={styles.wrapHeader}>
        <ImageBackground
          source={headerBackgroundImage}
          resizeMode="stretch"
          style={styles.wrapHeader}
        >
          <Image 
            source={nasaLogoImage}
            style={styles.logo}
          />
          <TextInput
            placeholder="Please Enter Date (YYYY-MM-DD)"
            style={styles.input}
            onChangeText={onChangeInput}
          ></TextInput>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => searchForAsteroids(text)}
          >
            <Text style={styles.btnText}>Search</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
}

const styles = StyleSheet.create({
    wrapHeader: {
        width: WIDTH,
        height: HEIGHT * 0.30,
      },
      input: {
        height: 40,
        width: WIDTH * 0.51,
        padding: 8,
        marginTop: HEIGHT * 0.15,
        fontSize: 12,
        border: 2,
        borderRadius: 5,
        borderColor: 'white',
        backgroundColor: 'white',
        alignSelf: 'center',
      },
      btn: {
        backgroundColor: '#555555',
        padding: 9,
        margin: 8,
        width: WIDTH * 0.51,
        alignSelf: 'center',
      },
      btnText: {
        color: '#FFFFFF',
        fontSize: 12,
        textAlign: 'center',
      },
      logo:{
        position: "absolute",
        width: 90,
        height: 90,
        marginTop: 9,
        alignSelf: 'center',
      }
});

export default Header;