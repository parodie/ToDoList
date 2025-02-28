import { View, Text, StyleSheet, TextInput } from "react-native";
import { useState } from "react";
import TaskPriority from "../models/TaskPriority";
import TaskData from "../data/TaskData";
import CustomButton from "../components/customButton";
import colors from "../colors";
import RNPickerSelect from "react-native-picker-select";


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
        {/*<TextInput
          style={styles.input}
          placeholder="Due Date (YYYY-MM-DD)"
          value={editedTask.dueDate}
          onChangeText={(text) =>
            setEditedTask({ ...editedTask, dueDate: text })
          }
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
        <CustomButton
          title="Modifier"
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
  
  addButton:{
    paddingVertical: 12,
  }
});

export default EditTaskScreen;
