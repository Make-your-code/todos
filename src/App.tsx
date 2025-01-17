import React, { useEffect, useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export type Paginate<T> = {
  data: T[];
  first: number;
  items: number;
  last: number;
  next: number | null;
  pages: number;
  prev: number | null;
};

export type ToggleTodoProps = Omit<Todo, "text">;

const BASE_URL = "http://localhost:4000/todos";

export default function App() {
  const [text, setText] = useState<Todo["text"]>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [doneTodos, setDoneTodos] = useState<Todo[]>([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleAddTodo = async () => {
    if (text.trim() === "") return;
    try {
      const newTodo: Todo = { id: crypto.randomUUID(), text, completed: false };
      await fetch(`${BASE_URL}`, { method: "POST", body: JSON.stringify(newTodo) });
      //   setTodos(prev => [...prev, newTodo]);
    } catch (e) {
      console.error();
    } finally {
      setText("");
    }
  };

  const handleKeyEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleAddTodo();
    }
  };

  const handleToggleTodo = async ({ id, completed }: ToggleTodoProps) => {
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          completed: !completed,
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: Todo["id"]) => {
    try {
      await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  };

  const getTodos = async (): Promise<Paginate<Todo>> => {
    const res = await fetch(`${BASE_URL}?_page=1&_per_page=25`);
    const data = await res.json();

    return data;
  };

  useEffect(() => {
    getTodos().then(data => {
      const todos = data.data;
      setTodos(todos.filter(todo => todo.completed !== true));
      setDoneTodos(todos.filter(todo => todo.completed !== false));
    });
  }, [todos, doneTodos]);

  return (
    <div id="todos-container">
      <h1>Todo List</h1>
      <div>
        <input type="text" onChange={handleTextChange} onKeyDown={handleKeyEnter} value={text} />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
      <TodoList todos={todos} onDelete={handleDelete} onToggle={handleToggleTodo} />
      <TodoList todos={doneTodos} onDelete={handleDelete} onToggle={handleToggleTodo} />
    </div>
  );
}
