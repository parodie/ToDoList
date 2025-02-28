import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import { useState } from "react";
import TaskPriority from "../models/TaskPriority";
import CustomButton from "../components/customButton";
import colors from "../colors";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";


function AddTaskScreen({categs}) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    //dueDate: "",
    priority: TaskPriority.Moyen,
    category: "",
  });

  const [tasks, setTasks] = useState([]);
  const priorities = [TaskPriority.Elevé, TaskPriority.Moyen, TaskPriority.Faible];
  const [categories, setCategories] = useState(categs);
  const [newCategory, setNewCategory] = useState("");
  const navigation = useNavigation();

  function handleAddCategory() {}

  const addTask = async () => {

    if (!newTask.title || !newTask.description || !newTask.category) {
      alert("Veuillez remplir tous les champs requis !");
      return;
    }
  
    const taskData = {
      titre: newTask.title,
      description: newTask.description,
      //dueDate: newTask.dueDate,
      priority: newTask.priority,
      category: newTask.category,
      created_at: new Date().toISOString(),
      user_id: userId
    };

    try{
      const userId = await AsyncStorage.getItem('user_id')

      const response = await fetch("https://172.20.10.13:8000/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user_id": userId,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la tâche");
      }
  
      const newTaskFromServer = await response.json();
  
      setTasks([...tasks, newTaskFromServer]); 
  
      setNewTask({
        title: "",
        description: "",
        //dueDate: "",
        priority: TaskPriority.Moyen,
        category: "",
      });
  
      navigation.navigate("Liste des taches");

    }catch(error){
      console.log('encountered Error :', error)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}></Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Titre..."
          value={newTask.title}
          onChangeText={(text) => setNewTask({ ...newTask, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description..."
          value={newTask.description}
          onChangeText={(text) => setNewTask({ ...newTask, description: text })}
        />
        {/*<TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={newTask.dueDate}
          onChangeText={(text) => setNewTask({ ...newTask, dueDate: text })}
        />*/}

        {/* Priority Picker */}
        <RNPickerSelect
          onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
          items={priorities.map((priority) => ({
            label: priority,
            value: priority,
          }))}
          value={newTask.priority}
          style={pickerSelectStyles}
          placeholder={{
            label: 'Selectionner la Priorité...',  
          }}
        />
        
        {/* Category Picker */}
        <RNPickerSelect
          onValueChange={(value) => setNewTask({ ...newTask, category: value })}
          items={categories.map((category) => ({
            label: category,
            value: category,
          }))}
          value={newTask.category}
          style={pickerSelectStyles}
          placeholder={{
            label: 'Selectionner une Categorie...',  
          }}
        />

        <View style={styles.addCategory}>
          <TextInput
            style={styles.inputCat}
            placeholder="Ajouter une categorie..."
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <CustomButton
            iconName={save}
            onPress={handleAddCategory}
            iconColor={colors.black}
            style={styles.addButton}
          />
        </View>
        <CustomButton
          title="Ajouter"
          onPress={addTask}
          textColor={colors.cream}
          backgroundColor={colors.black}
          style={styles.addButton}
        />
      </View>
    </ScrollView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    width: "100%",
    backgroundColor: colors.lightgrey,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 20,
    color: colors.black,
  },
  inputAndroid: {
    height: 40,
    width: "100%",
    backgroundColor: colors.lightgrey,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,
    color: colors.black,
  },
});


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,  // Ensure the content can scroll
    backgroundColor: "white",
    padding: 40,  
    paddingTop: 90
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  form: {
    flexDirection: "column",
    marginTop: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "black",
  },
  addCategory: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  inputCat: {
    flex: 1,
    marginRight: 10,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  addButton: {
    paddingVertical: 12,
  },

});
export default AddTaskScreen;
