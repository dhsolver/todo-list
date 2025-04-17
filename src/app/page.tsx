"use client";

import { Todo } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodos(data);
  };

  const handleAdd = async () => {
    if (!title.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        dueDate,
        createdAt: Date.now(),
      }),
    });
    setTitle("");
    setDescription("");
    setDueDate("");
    fetchTodos();
  };

  const toggleComplete = async (
    id: string,
    current: boolean,
    index: number
  ) => {
    await fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...todos[index],
        isCompleted: !current,
      }),
    });
    fetchTodos();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  const handleItem = (id: string) => {
    router.push(`/${id}`);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>📝 To-Do List</h1>

        <div style={{ marginBottom: "1rem" }}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
          />
          <button onClick={handleAdd} style={{ padding: "0.5rem 1rem" }}>
            ➕ Add Task
          </button>
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((todo, index) => (
            <li
              key={todo.id}
              style={{
                marginBottom: "1rem",
                padding: "0.75rem",
                background: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
            >
              <div>
                <strong>{todo.title}</strong> {todo.isCompleted ? "✅" : ""}
              </div>
              {todo.dueDate && <div>Due: {todo.dueDate}</div>}
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  onClick={() =>
                    toggleComplete(todo.id, todo.isCompleted, index)
                  }
                >
                  {todo.isCompleted ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  ❌ Delete
                </button>
                <button
                  onClick={() => handleItem(todo.id)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
