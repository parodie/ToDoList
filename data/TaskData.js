import TaskStatus from "../models/TaskStatus";

export const TaskData = [
  {
    id: "1",
    title: "Acheter des courses",
    description: "Acheter des légumes et du pain",
    creationDate: "2025-02-24",
    dueDate: "2025-02-28",
    priority: "High",
    category: "Shopping",
    status: TaskStatus.TODO,
  },
  {
    id: "2",
    title: "Compléter le projet",
    description: "Terminer les tâches restantes",
    creationDate: "2025-02-25",
    dueDate: "2025-02-26",
    priority: "Medium",
    category: "Travail",
    status: TaskStatus.IN_PROGRESS,
  },
  {
    id: "3",
    title: "Lire un livre",
    description: 'Lire un chapitre du livre "React Native"',
    creationDate: "2025-02-20",
    dueDate: "2025-03-01",
    priority: "Low",
    category: "Loisirs",
    status: TaskStatus.DONE,
  },
];

export default TaskData;
