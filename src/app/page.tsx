"use client";

import { Todo } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  const toggleComplete = async (todo: Todo) => {
    await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        isCompleted: !todo.isCompleted,
      }),
    });
    fetchTodos();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-start sm:items-start">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900">
          📝 To-Do List
        </h1>
        <a
          href={`/new`}
          className="flex justify-between items-center space-x-4 text-black"
        >
          Add Task
        </a>

        <ul>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="p-4 border-t border-gray-300 hover:bg-gray-100"
            >
              <a
                href={`/${todo.id}`} // Link to Todo detail page
                className="flex justify-between items-center space-x-4 text-black"
              >
                <div className="flex-1">
                  <strong>{todo.title}</strong>
                  {todo.dueDate && (
                    <span className="ml-2 text-sm text-gray-600">
                      — Due by {todo.dueDate}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleComplete(todo);
                    }}
                    className="text-black"
                  >
                    {todo.isCompleted ? (
                      <span className="material-icons">Completed</span>
                    ) : (
                      <span className="material-icons">Incompleted</span>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation for the button
                      handleDelete(todo.id);
                    }}
                    className="text-black"
                  >
                    <span className="material-icons">delete</span>{" "}
                  </button>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
