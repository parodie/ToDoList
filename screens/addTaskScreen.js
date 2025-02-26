import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useState, useEffect } from "react";
import TaskPriority from "../models/TaskPriority";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../components/customButton";
import colors from "../colors";
import { useNavigation } from "@react-navigation/native";

function AddTaskScreen() {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: TaskPriority.HIGH,
    category: "",
  });

  const [taskId, setTaskId] = useState(1);
  const [tasks, setTasks] = useState([]);
  const priorities = [TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW];
  const [categories, setCategories] = useState([
    "Work",
    "Personal",
    "Shopping",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const navigation = useNavigation();

  function handleAddCategory() {}

  function addTask() {
    const task = {
      id: taskId,
      title: newTask.title,
      description: newTask.description,
      creationDate: new Date().toISOString(),
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      category: newTask.category,
    };

    setTasks([...tasks, task]);
    setTaskId(taskId + 1);
    setNewTask({
      ...newTask,
      title: "",
      description: "",
      dueDate: "",
      priority: TaskPriority.HIGH,
      category: "",
    });
    navigation.navigate("Liste des taches");
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My TODO Application</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Task title..."
          value={newTask.title}
          onChangeText={(text) => setNewTask({ ...newTask, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description..."
          value={newTask.description}
          onChangeText={(text) => setNewTask({ ...newTask, description: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Due Date (YYYY-MM-DD)"
          value={newTask.dueDate}
          onChangeText={(text) => setNewTask({ ...newTask, dueDate: text })}
        />
        <Picker
          selectedValue={newTask.priority}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setNewTask({ ...newTask, priority: itemValue })
          }
        >
          {priorities.map((priority, index) => (
            <Picker.Item key={index} label={priority} value={priority} />
          ))}
        </Picker>
        <Picker
          selectedValue={newTask.category}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setNewTask({ ...newTask, category: itemValue })
          }
        >
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
        <View style={styles.addCategory}>
          <TextInput
            style={styles.inputCat}
            placeholder="Add new category..."
            value={newCategory}
            onChangeText={setNewCategory}
          />
          <CustomButton
            title="Add"
            onPress={handleAddCategory}
            textColor={colors.cream}
            style={styles.addButton}
          />
        </View>
        <CustomButton
          title="Save"
          onPress={addTask}
          textColor={colors.cream}
          style={styles.addButton}
        />
      </View>
    </View>
  );
}

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
  picker: {
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: "black",
    fontSize: 16,
  },
  addCategory: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputCat: {
    flex: 1,
    marginRight: 10,
  },
});

export default AddTaskScreen;
