import { View, Text, StyleSheet, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import TaskPriority from "../models/TaskPriority";
import CustomButton from "../components/customButton";
import colors from "../colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { TasksContext } from "../context/tasksContext";


function AddTaskScreen() {
  const route = useRoute()
  const { fetchTasks, fetchCategories } = useContext(TasksContext);
  const [newCategory, setNewCategory] = useState("");
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {categs}= route.params || {};

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: TaskPriority.Moyen,
    category: "",
  });

  const [categories, setCategories] = useState(
    categs.map((categorie) => ({
      label: categorie.name,
      value: categorie.id,
    })) || []
  );

  const priorities = [
    { label: "Elevé", value: TaskPriority.Elevé },
    { label: "Moyen", value: TaskPriority.Moyen },
    { label: "Faible", value: TaskPriority.Faible },
  ];
  

  //-----------------------------------------------------------

  async function handleAddCategory() {
    
    if (!newCategory.trim()) {
      alert("Veuillez entrer une catégorie valide.");
      return;
    }
    //----------------------------
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) {
        alert("Utilisateur non authentifié");
        return;
      }

      const categoryData = { name: newCategory, user_id: userId };

      const response = await fetch(
        "http://172.20.10.13:8000/api/categories/add_category/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        }
      );

      if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
      const data = await response.json();

      if (data.category) {
        await fetchCategories(userId);

        setCategories((prev) => [
          ...prev,
          { label: data.category.name, value: data.category.id },
        ]);

        setNewCategory("");
        alert("Catégorie ajoutée avec succès !");

      } else {
        alert("Erreur lors de l'ajout de la catégorie.");
      }
    } catch (error) {
      alert(`Erreur de réseau ou serveur : ${error.message}`);
    }finally{
      setLoading(false)
    }
  }

  //-----------------------------------------------
  async function addTask() {
    if (!newTask.title || !newTask.description || !newTask.category) {
      alert("Veuillez remplir tous les champs requis !");
      return;
    }

    const taskData = {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      created_at: new Date().toISOString(),
      user_id: await AsyncStorage.getItem("user_id"),
    };

    try {
      setLoading(true)
      const response = await fetch(`http://172.20.10.13:8000/api/tasks/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout de la tâche");
      const newTask = await response.json();

      const user_id = await AsyncStorage.getItem("user_id");
      await fetchTasks(user_id);

      setNewTask({
        title: "",
        description: "",
        priority: TaskPriority.Moyen,
        category: "",
      });

      // Navigate to the task list
      navigation.goBack();    
    } catch (error) {
      alert(`Erreur lors de l'ajout de la tâche : ${error.message}`);
    }finally{
      setLoading(false)
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

        {/* Priority Picker */}
        <RNPickerSelect
          onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
          items={priorities}
          value={newTask.priority}
          style={pickerSelectStyles}
          placeholder={{
            label: "Selectionner la Priorité...",
          }}
        />

        {/* Category Picker */}
        <RNPickerSelect
          onValueChange={(value) => setNewTask({ ...newTask, category: value })}
          items={categories}
          value={newTask.category}
          style={pickerSelectStyles}
          placeholder={{
            label: "Selectionner une Categorie...",
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
            iconName="save"
            onPress={handleAddCategory}
            iconColor={colors.cream}
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
    flexGrow: 1,
    backgroundColor: "white",
    padding: 40,
    paddingTop: 90,
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
    paddingVertical: 10,
  },
});

export default AddTaskScreen;
