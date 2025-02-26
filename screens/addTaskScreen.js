import { View, Text, StyleSheet } from "react-native";

function AddTaskScreen() {
  return (
    <View style={styles.constainer}>
      <Text style={styles.title}>My TODO Application</Text>
    </View>
  );
}

export default AddTaskScreen;

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
    padding: 20,
  },
});
