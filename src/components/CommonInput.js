import React from "react";
import { Text, View, TextInput, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { Colors } from "../constants/Theme";

export function CommonInput(props) {
    // console.log(props)
    const {name, rules={}, control, customerdata, placeholder="", keyboardType, error=null, editable="" } = props;
    // console.log("customerdata", editable)
    return (
        <View style={{ marginBottom: 5}}>
            <Controller
                control={control}
                rules={rules}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        placeholder={placeholder}
                        style={styles.input}
                        onChangeText={onChange}
                        value={value}
                        editable={editable}
                        selectTextOnFocus={editable}
                        keyboardType={keyboardType}
                    />
                )}
                name={name}
            />
            {
                error &&
                <Text style={{color: 'red'}}>{error}</Text>
            }
        </View>
    )

}
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 20,
    },
    input: {
        // justifyContent: 'center',
        borderColor: Colors.secondary,
        // backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 15,
        // marginVertical: 10,
        marginBottom: 3

    },
    picker: {
        height: 25,
    }
})