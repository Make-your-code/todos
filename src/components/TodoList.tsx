import React from "react";
import "../App.css";
import { type Todo, type ToggleTodoProps } from "../App";

type TodoListProps = {
  todos: Todo[];
  onDelete: (id: Todo["id"]) => void;
  onToggle: (todoToggle: ToggleTodoProps) => void;
};
function TodoList({ todos, onDelete, onToggle }: TodoListProps) {
  return (
    <div>
      <ul>
        {todos.map((todo: Todo) => (
          <li id={todo.id}>
            {todo.completed ? <p style={{ textDecoration: "line-through" } as React.CSSProperties}>{todo.text}</p> : <p>{todo.text}</p>}
            <button
              onClick={() => {
                onToggle({ id: todo.id, completed: todo.completed });
              }}
            >
              {todo.completed ? "Undo" : "Complete"}
            </button>
            <button
              onClick={() => {
                onDelete(todo.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
