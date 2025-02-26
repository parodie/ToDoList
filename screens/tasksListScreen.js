import { View, StyleSheet, Alert, Text, ScrollView   } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import TaskData from "../data/TaskData";
import CategoryData from "../data/CategoryData";
import TaskItem from "../components/taskItem";
import { useState } from "react";
import colors from "../colors";
import CustomButton from "../components/customButton";

function TaksListScreen() {

    const [tasks, setTasks] = useState(TaskData)

    const data = CategoryData.map((category) => {
        return {
          id: category.id,
          type: "category",
          name: category.name,
          tasks: tasks.filter((task) => task.category === category.name),
        };
      });
    


    function deleteHandler(id){
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () =>  handleDelete(id),
                    style: "destructive"
                }
            ]
        );
    }

    function handleDelete(id){
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
    }

    function handleModify(id){
        //redirect to modify screen
        Alert.alert(
            "Modify Task",
            "Do you want to modify this task?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Modify",
                    onPress: () => {
                        console.log("Task modified!"); 
                    },
                    style: "default"
                }
            ]
        );
    }



    function handleAddTask(){
        Alert.alert(
            "Add Task",
            "Do you want to add a new task?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Add",
                    onPress: () => {
                        console.log("Task added!"); 
                    },
                    style: "default"
                }
            ]
        );
    }

    function renderItem(itemData) {
        if (itemData.item.type === "category") {
          return (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{itemData.item.name.toUpperCase()}</Text>
              {itemData.item.tasks.map((task) => (
                <TaskItem key={task.id} id={task.id} title={task.title} onDelete={deleteHandler} onModify={handleModify}/>
              ))}
            </View>
          );
        }
    }


  return (
    <View style={styles.container}>
    <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id} 
    />
    <CustomButton 
            title="Ajouter une tache"
            onPress={handleAddTask}
            textColor={colors.cream}
            style={styles.addButton}
          />
  </View>
  );
}

export default TaksListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",  
        paddingTop: 20,
        paddingHorizontal: 20,
        justifyContent: 'flex-start'
      },
      categoryContainer: {
        marginBottom: 20,
      },
      categoryTitle: {
        fontSize: 14,
        marginBottom: 10,
        color: colors.golden,
      },
      addButton: {
        position: 'absolute',  
        bottom: 30,           
        left: '20%',           
        transform: [{ translateX: -50 }], 
        paddingVertical: 14,
        paddingHorizontal: 130,
        borderRadius: 5,
        elevation: 5,  
      }
      
});
