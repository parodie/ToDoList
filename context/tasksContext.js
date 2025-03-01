import { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
    const [tasks, setTasks] = useState([])
    const [categories, setCategories] = useState([]);

    //---------------------(Tasks)---------------------------
    const fetchTasks = async (userId) => {
        const url = `http://172.20.10.13:8000/api/tasks/?user_id=${userId}`;
        const response = await fetch(url);

        const data = await response.json();
        //console.log("Tasks API Response:", data);
        setTasks(Array.isArray(data) ? data : data.tasks || []);

        return Array.isArray(data) ? data : data.tasks || [];
    }

    //--------------------(Categories)-----------------
    const fetchCategories = async (userId) => {
        try {
          const url = `http://172.20.10.13:8000/api/categories/?user_id=${userId}`;
    
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

          setCategories(Array.isArray(data) ? data : data.tasks || []);
          //console.log("data:", data);
          return Array.isArray(data) ? data : data.tasks || [];

        } catch (error) {
          console.error("Erreur réseau :", error.message);
        }
      };

      //--------------------(delete)-----------------
      const deleteTask = async (taskId) => {
        const user_id = await AsyncStorage.getItem("user_id");
        const url = `http://172.20.10.13:8000/api/tasks/${taskId}/`;
        try{
          const response = await fetch(url, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          });

          if(response.status === 204 || response.ok){
            setTasks(tasks.filter((task) => task.id !== taskId));
          }else {
            const errorText = await response.text();
            console.error("Delete failed:", errorText);
            Alert.alert("Error", "Failed to delete the task.");
          }
        }catch(error){
          console.error("Error deleting task:", error);
          Alert.alert("Error", "Something went wrong.");
        }
        
      };

      return (
        <TasksContext.Provider value={{tasks, categories, fetchTasks, fetchCategories, deleteTask}}>
            {children}
        </TasksContext.Provider>
      );
}