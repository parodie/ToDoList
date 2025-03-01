import { View, StyleSheet, Alert, Text, ActivityIndicator } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import TaskItem from "../components/taskItem";
import { useEffect, useState, useContext } from "react";
import colors from "../colors";
import CustomButton from "../components/customButton";
import { useNavigation } from "@react-navigation/native";
import { TasksContext } from "../context/tasksContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

function TasksListScreen() {
  //const [tasks, setTasks] = useState(TaskData);
  //const [tasks, setTasks] = useState([]);
  //const [categories, setCategories] = useState([]);
  const { tasks, categories, fetchTasks, fetchCategories, deleteTask } = useContext(TasksContext);
  const [checkedTasks, setCheckedTasks] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  

  useEffect(() => {
    const InitializeApp = async () => {
      try {
        //fetch user id if exists else create a new one (1)
        const user_id = await InitializeUser();
        console.log("User ID:", user_id);

        //fetch user specific categories (2)
        const categs = await fetchCategories(user_id);

        console.log("cats", categs);
        //fetch user specific tasks (3)
        const tasks = await fetchTasks(user_id);

        /*console.log(
          "Fetched tasks:",
          tasks,
          "Type:",
          typeof tasks,
          "Is array:",
          Array.isArray(tasks)
        );*/

        const completedTasks = tasks.filter((task) => task.completed).map((task)=> task.id)
        setCheckedTasks(new Set(completedTasks));

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

    const url = `http://172.20.10.13:8000/api/categories/initialize_user/`;

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

  //-----------------------------------------------------
  function deleteHandler(id) {
    Alert.alert("Supprimer la tache", "voulez vous vraiment supprimer cette tache?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        onPress: async () => {
          try {
            await deleteTask(id)

            const user_id = await AsyncStorage.getItem("user_id");
            if (!user_id) {
              throw new Error("User ID not found in AsyncStorage");
            }
            
            await fetchTasks(user_id);

            Alert.alert("Succès", "La tâche a été supprimée avec succès.");
          }catch(error){
            console.error("Error deleting task:", error.message);
            Alert.alert("Erreur", "La suppression de la tâche a échoué. Veuillez réessayer.");
          }
        },
        style: "destructive",
      },
    ]);
  }

  const data = categories.map((category) => {
    const tasksForCategory = tasks.filter((task) => {
      /*console.log(
        `Comparing category.id: ${category.id} with task.category: ${task.category}`
      );*/
      return task.category === category.id;
    });

    return {
      id: category.id,
      type: "category",
      name: category.name,
      tasks: tasksForCategory,
    };
  });

  //--------------------------------------------------------
  function handleModify(id) {
    Alert.alert("Modifier la tache", "voulez vous vraiment modifier cette tache?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Modifier",
        onPress: () =>
          navigation.navigate("Modifier la tache", {
            taskId: id,
            categs: categories,
          }),
        style: "default",
      },
    ]);
  }

  //------------------------------------------------------------
  function handleAddTask() {
    if (!categories || categories.length === 0) {
      alert("Aucune catégorie disponible.");
      return;
    }
    
    navigation.navigate("Ajouter une tache", {
      categs: categories,
    });
  }

  //----------------------------------------------------------
  const handleCheck = async (id) => {
    const updatedCheckedTasks = new Set(checkedTasks);
    const isCompleted = updatedCheckedTasks.has(id);

    if (updatedCheckedTasks.has(id)) {
      updatedCheckedTasks.delete(id);
    } else {
      updatedCheckedTasks.add(id);
    }

    setCheckedTasks(updatedCheckedTasks);

    try{
      user_id = await AsyncStorage.getItem('user_id');

      //console.log('userId when modifying checkbox : ', user_id)

      const response = await fetch(`http://172.20.10.13:8000/api/tasks/${id}/`, {
        method: 'PATCH',
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ completed: !isCompleted })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      await fetchTasks(user_id);

    }catch(error){
      console.error("Error updating task:", error.message);

      setCheckedTasks((prev) => {
        const revertedCheckedTasks = new Set(prev);
        if (isCompleted) {
          revertedCheckedTasks.add(id); 
        } else {
          revertedCheckedTasks.delete(id); 
        }
        return revertedCheckedTasks;
      });

      Alert.alert("Error", "Failed to update task. Please try again.");
    }
  }

  //-------------------------------------------------------------
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
