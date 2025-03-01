import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TaksListScreen from "./screens/tasksListScreen";
import AddTaskScreen from "./screens/addTaskScreen";
import EditTaskScreen from "./screens/editTaskScreen";
import { TasksProvider } from "./context/tasksContext";


const Stack = createStackNavigator();

export default function App() {
  return (
    <TasksProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Liste des taches">
          <Stack.Screen name="Liste des taches" component={TaksListScreen} />
          <Stack.Screen name="Ajouter une tache" component={AddTaskScreen} />
          <Stack.Screen name="Modifier la tache" component={EditTaskScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TasksProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
