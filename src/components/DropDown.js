import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
// import imagesPath from './constants/imagesPath';
// import {useState} from "react";
import { Picker } from '@react-native-picker/picker';
import { Controller } from 'react-hook-form';
import { Colors } from '../constants/Theme'

function DropDown(props) {
    const { error = "", name, control, dropdown = [], selectedState } = props;
    console.log("dropdown", selectedState);


    const [pickervalue, setPickervalue] = useState('English')

    return (
        // <View>
        <View style={styles.dropdown}>
            <Controller
                control={control}
                name={name}
                render={({ field: { value, onChange } }) => (
                    <Picker
                        style={styles.picker}
                        selectedValue={value}
                        onValueChange={(value) => {
                            onChange(value);
                        }}
                    >
                        {
                            dropdown.map((state, index) => (
                                <Picker.Item label={state.name} value={state.id} key={index} />
                            ))
                        }
                    </Picker>
                )}
            />
        </View>
        // {
        // error!=="" &&
        //     <Text>{error}</Text>
        // }
        // </View>
    )
}

export const DropDown2 = ({ value = "", onChange = {}, dropdown = [], }) => {
    return (
        <View style={styles.dropdown}>
            <Picker
                style={styles.picker}
                selectedValue={value}
                onValueChange={(val) => {
                    onChange(val);
                }}
            >
                {
                    dropdown.map((state, index) => (
                        <Picker.Item label={state.name} value={state.id} key={index} />
                    ))
                }
            </Picker>
        </View>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        justifyContent: 'center',
        borderColor: Colors.secondary,
        // backgroundColor: 'rgba(0,0,0,0.2)',
        borderWidth: 1,
        borderRadius: 5,
        // padding: 8,
        // marginVertical: 10,
        marginBottom: 20

    },
    picker: {
        // height: 25,
    }
})
export default DropDown;