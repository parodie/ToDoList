import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TaksListScreen from "./screens/tasksListScreen";
import AddTaskScreen from "./screens/addTaskScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Liste des taches">
        <Stack.Screen name="Liste des taches" component={TaksListScreen} />
        <Stack.Screen name="Add A Task" component={AddTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
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
