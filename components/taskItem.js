import { View, StyleSheet, Text } from "react-native";
import Checkbox from 'expo-checkbox';
import CustomButton from "./customButton";
import colors from "../colors";

function TaskItem({id, title, onDelete, onModify, isChecked, onToggleChecked }){

    function handleDelete(){
        onDelete(id);
    }

    function handleModify(){
        onModify(id);
    }


    return (
        <View style={styles.taskContainer}>
            <Checkbox
                value={isChecked}
                onValueChange={() => onToggleChecked(id)} 
                style={styles.checkbox}
                color={colors.lightGolden}
                
            />
            <Text style={[styles.textStyle, isChecked && styles.checkedTitle]}>{title}</Text>
            <View style={styles.buttonsContainer}>

                <CustomButton 
                    iconName='create'
                    backgroundColor={colors.lightgrey}
                    onPress={handleModify}
                    iconColor={colors.lightGolden}

                />
                <CustomButton 
                    iconName='trash'
                    backgroundColor={colors.lightgrey}
                    onPress={handleDelete}
                    iconColor={colors.lightGolden}
                />
                
            </View>
        </View>
    );
}

export default TaskItem;

const styles = StyleSheet.create({
    taskContainer :{
        flex : 1,
        backgroundColor: colors.lightgrey, 
        padding: 10,  
        marginBottom: 10, 
        borderRadius: 8, 
        justifyContent: 'space-between',
        alignContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    textStyle: {
        color: colors.black,
        fontSize: 14
    },
    buttonsContainer :{
        flex:1,
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    checkedTitle :{
        textDecorationLine: 'line-through', 
        color: colors.lightGolden
    },
    checkbox: {
        margin: 8,
    }
})