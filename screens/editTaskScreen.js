import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useState, useEffect } from "react";
import TaskPriority from "../models/TaskPriority";
import { Picker } from "@react-native-picker/picker";
import TaskData from "../data/TaskData";
import CustomButton from "../components/customButton";
import colors from "../colors";

function EditTaskScreen({ route, navigation }) {
  const { taskId } = route.params;
  const task = TaskData.find((t) => t.id === taskId);

  const [editedTask, setEditedTask] = useState(task);

  const priorities = [TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW];
  const categories = ["Work", "Personal", "Shopping"];

  function handleSave() {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Edit Task</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Task title..."
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
        <TextInput
          style={styles.input}
          placeholder="Due Date (YYYY-MM-DD)"
          value={editedTask.dueDate}
          onChangeText={(text) =>
            setEditedTask({ ...editedTask, dueDate: text })
          }
        />
        <Picker
          selectedValue={editedTask.priority}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setEditedTask({ ...editedTask, priority: itemValue })
          }
        >
          {priorities.map((priority, index) => (
            <Picker.Item key={index} label={priority} value={priority} />
          ))}
        </Picker>
        <Picker
          selectedValue={editedTask.category}
          style={styles.picker}
          onValueChange={(itemValue) =>
            setEditedTask({ ...editedTask, category: itemValue })
          }
        >
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>
        <CustomButton
          title="Save Changes"
          onPress={handleSave}
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
});

export default EditTaskScreen;
