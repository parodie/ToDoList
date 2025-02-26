import TaskStatus from "./TaskStatus";

export default class Task {
  constructor(
    id,
    title,
    description,
    creationDate,
    dueDate,
    priority,
    category,
    status
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.creationDate = creationDate;
    this.dueDate = dueDate;
    this.dueDate = dueDate;
    this.priority = priority;
    this.category = category;
    this.status = status || TaskStatus.TODO;
  }
}
