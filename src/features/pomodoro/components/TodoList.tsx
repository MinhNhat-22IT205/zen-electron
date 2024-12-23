import React, { useState } from "react";
import { Input } from "@/src/shared/components/shadcn-ui/input";
import { Button } from "@/src/shared/components/shadcn-ui/button";
import { Checkbox } from "@/src/shared/components/shadcn-ui/checkbox";
import { useDraggable } from "../hooks/useDraggable";
import { TrashIcon } from "@radix-ui/react-icons";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Task1", completed: false },
    { id: 2, text: "Task2", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const { position } = useDraggable("todo-list");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div
      id="todo-list"
      className="absolute bg-white p-4 rounded-lg shadow-lg w-80"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: "move",
      }}
    >
      <div>
        <h2 className="text-2xl font-semibold mb-4">Task List</h2>
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
          />
          <Button onClick={addTask}>Add</Button>
        </div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center space-x-2 group">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
              />
              <span
                className={
                  task.completed ? "line-through flex-grow" : "flex-grow"
                }
              >
                {task.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteTask(task.id)}
              >
                <TrashIcon className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
