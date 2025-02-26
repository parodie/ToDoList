import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useState } from "react";
import TaskPriority from "../models/TaskPriority";
import { Picker } from "@react-native-picker/picker";

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
  const [categories, setCategories] = useState("");

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
        <Button title="Save" onPress={addTask} />
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
});

export default AddTaskScreen;
