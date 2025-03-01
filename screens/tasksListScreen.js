import { View, StyleSheet, Alert, Text, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import TaskItem from "../components/taskItem";
import { useEffect, useState } from "react";
import colors from "../colors";
import CustomButton from "../components/customButton";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function TasksListScreen() {
  //const [tasks, setTasks] = useState(TaskData);
  const [tasks, setTasks] = useState([]);
  const [checkedTasks, setCheckedTasks] = useState(new Set());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const InitializeApp = async () => {
      try {
        //fetch user id if exists else create a new one (1)
        const user_id = await InitializeUser();
        console.log("User ID:", user_id);

        //fetch user specific categories (2)
        const categories = await fetchCategories(user_id);
        setCategories(categories);
        console.log("cats", categories);

        //fetch user specific tasks (3)
        const tasks = await fetchTasks(user_id);
        setTasks(tasks);

        console.log(
          "Fetched tasks:",
          tasks,
          "Type:",
          typeof tasks,
          "Is array:",
          Array.isArray(tasks)
        );
      } catch (error) {
        console.error("Error initializing app:", error);
        Alert.alert(
          "Error",
          "Could not connect to the server. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    InitializeApp();
  }, []);

  //--------------------(1)----------------------
  const InitializeUser = async () => {
    console.log("Starting app initialization...");

    console.log("Getting user ID...");
    let userId = await AsyncStorage.getItem("user_id");
    console.log("user_id : ", userId);
    const url = `http://192.168.100.71:8000/api/categories/initialize_user/`;
    if (!userId) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({}),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", JSON.stringify(response.headers));

      const data = await response.json();
      console.log("data : ", data);

      userId = data.user_id;
      console.log("userId : ", userId);

      await AsyncStorage.setItem("user_id", userId);
    }
    return userId;
  };

  //--------------------(2)----------------------
  const fetchCategories = async (userId) => {
    try {
      const url = `http://192.168.100.71:8000/api/categories/?user_id=${userId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("data:", data);
      return data;
    } catch (error) {
      console.error("Erreur réseau :", error.message);
    }
  };

  //--------------------(3)----------------------
  const fetchTasks = async (userId) => {
    const url = `http://192.168.100.71:8000/api/tasks/?user_id=${userId}`;
    const response = await fetch(url);

    const data = await response.json();
    console.log("Tasks API Response:", data);

    return Array.isArray(data) ? data : data.tasks || [];
  };

  //-----------------(4)------------------------
  const deleteTask = async (taskId) => {
    const user_id = await AsyncStorage.getItem("user_id");
    const url = `http://192.168.100.71:8000/api/tasks/${taskId}/`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  function deleteHandler(id) {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => deleteTask(id),
        style: "destructive",
      },
    ]);
  }

  const data = categories.map((category) => {
    const tasksForCategory = tasks.filter((task) => {
      console.log(
        `Comparing category.id: ${category.id} with task.category: ${task.category}`
      );
      return task.category === category.id;
    });

    return {
      id: category.id,
      type: "category",
      name: category.name,
      tasks: tasksForCategory,
    };
  });

  function handleModify(id) {
    Alert.alert("Modify Task", "Do you want to modify this task?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Modify",
        onPress: () =>
          navigation.navigate("Modifier la tache", {
            taskId: id,
            categs: categories,
          }),
        style: "default",
      },
    ]);
  }

  function handleAddTask() {
    if (!categories || categories.length === 0) {
      alert("Aucune catégorie disponible.");
      return;
    }
    navigation.navigate("Ajouter une tache", {
      categs: categories,
    });
  }

  function handleCheck(id) {
    const updatedCheckedTasks = new Set(checkedTasks);

    if (updatedCheckedTasks.has(id)) {
      updatedCheckedTasks.delete(id);
    } else {
      updatedCheckedTasks.add(id);
    }

    setCheckedTasks(updatedCheckedTasks);
  }

  function renderItem(itemData) {
    if (itemData.item.type === "category") {
      return (
        <View style={styles.categoryContainer} key={itemData.item.id}>
          <Text style={styles.categoryTitle}>
            {itemData.item.name.toUpperCase()}
          </Text>
          {itemData.item.tasks?.length > 0 ? (
            itemData.item.tasks.map((task) => (
              <TaskItem
                key={task.id}
                id={task.id}
                title={task.title}
                onDelete={deleteHandler}
                onModify={handleModify}
                onToggleChecked={handleCheck}
                isChecked={checkedTasks.has(task.id)}
              />
            ))
          ) : (
            <View>
              <Text></Text>
              <Text></Text>
              <Text></Text>
              <Text></Text>
              <Text></Text>
            </View>
          )}
        </View>
      );
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
      <View style={styles.listStyle}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
      <CustomButton
        title="Ajouter une tache"
        onPress={handleAddTask}
        textColor={colors.cream}
        style={styles.addButton}
      />
    </View>
  );
}

export default TasksListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 20,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 14,
    marginBottom: 10,
    color: colors.golden,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    left: "20%",
    transform: [{ translateX: -50 }],
    paddingVertical: 14,
    paddingHorizontal: 130,
    borderRadius: 5,
    elevation: 5,
  },
  listStyle: {
    paddingBottom: 90,
  },
});
