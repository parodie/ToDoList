import { View, Text, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { useState, useEffect, useContext } from "react";
import TaskPriority from "../models/TaskPriority";
import CustomButton from "../components/customButton";
import colors from "../colors";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TasksContext } from "../context/tasksContext";


function EditTaskScreen({ route, navigation }) {

  const { fetchTasks, fetchCategories } = useContext(TasksContext)
  const { taskId, categs } = route.params;
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(
    categs.map((categorie) => ({
      label: categorie.name,
      value: categorie.id,
    })) || []
  );



  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    priority: TaskPriority.Moyen,
    category: "",
  });

  const priorities = [
    { label: "Elevé", value: TaskPriority.Elevé },
    { label: "Moyen", value: TaskPriority.Moyen },
    { label: "Faible", value: TaskPriority.Faible },
  ];

  useEffect(() => {
    if (taskId) {
      async function fetchTask() {
        try{
        const task = await fetch(
          `http://172.20.10.13:8000/api/tasks/${taskId}/`
        );
        if (task.ok) {
          const taskData = await task.json();
          setEditedTask(taskData);
        } else {
          alert("Tâche non trouvée.");
        }
      }catch(error){
        console.log("Erreur lors du chargement de la tâche: " + error.message);
      }finally{
        setLoading(false)
      }
    }

    fetchTask();

      } else {
        alert("ID de tâche manquant.");
        setLoading(false);
      }
  }, [taskId]);

  async function handleSave() {
    setLoading(true);
    const user_id = await AsyncStorage.getItem("user_id");
    const updatedTaskData = {};

    if (editedTask.title.trim()){ 
      updatedTaskData.title = editedTask.title;
    }
    if (editedTask.description.trim()){
      updatedTaskData.description = editedTask.description;
    }
    if (editedTask.priority) {
      updatedTaskData.priority = editedTask.priority;
    }
    if (editedTask.category){ 
      updatedTaskData.category = editedTask.category;
    }

    if (Object.keys(updatedTaskData).length > 0) {
      try {
        const response = await fetch(
          `http://172.20.10.13:8000/api/tasks/${taskId}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              user_id: user_id,
            },
            body: JSON.stringify(updatedTaskData),
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
  
        const data = await response.json();
        await fetchTasks(user_id);

        alert("Tâche mise à jour avec succès !");
        navigation.goBack();
      } catch (error) {
        alert("Erreur lors de la mise à jour de la tâche : " + error.message);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Aucune modification détectée.");
      setLoading(false); 
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.lightGolden} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}></Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Titre..."
          value={editedTask.title}
          onChangeText={(text) => setEditedTask({ ...editedTask, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description..."
          value={editedTask.description}
          onChangeText={(text) =>
            setEditedTask({ ...editedTask, description: text })
          }
        />

        {/* Priority Picker */}
        <RNPickerSelect
          onValueChange={(value) =>
            setEditedTask({ ...editedTask, priority: value })
          }
          items={priorities}
          value={editedTask.priority}
          style={pickerSelectStyles}
          placeholder={{ label: "Sélectionner la priorité..." }}
        />

        {/* Category Picker */}
        <RNPickerSelect
          onValueChange={(value) =>
            setEditedTask({ ...editedTask, category: value })
          }
          items={categories.map((category) => ({
            label: category.label,
            value: category.value,
          }))}
          value={editedTask.category}
          style={pickerSelectStyles}
          placeholder={{ label: "Sélectionner une catégorie..." }}
        />

        <CustomButton
          title="Sauvegarder"
          onPress={handleSave}
          textColor={colors.cream}
          style={styles.addButton}
        />
      </View>
    </View>
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
    flex: 1,
    backgroundColor: "white",
  },
  titleContainer: {
    margin: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  form: {
    flexDirection: "column",
    margin: 30,
    padding: 30,
    alignItems: "stretch",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    color: "black",
  },
  addButton: {
    paddingVertical: 12,
  },
});

export default EditTaskScreen;
