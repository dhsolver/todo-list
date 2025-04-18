"use client";

import { Todo } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const router = useRouter();

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
      body: JSON.stringify({ isCompleted: !todo.isCompleted }),
    });
    fetchTodos();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  const handleAdd = () => {
    router.push(`/new`);
  };

  // Apply filtering
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.isCompleted;
    if (filter === "incomplete") return !todo.isCompleted;
    if (filter === "overdue")
      return todo.dueDate && new Date(todo.dueDate) < new Date();
    return true;
  });

  // Apply sorting
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title);
    if (sortBy === "dueDate") {
      const aDate = a.dueDate
        ? new Date(a.dueDate)
        : new Date(8640000000000000); // max date
      const bDate = b.dueDate
        ? new Date(b.dueDate)
        : new Date(8640000000000000);
      return aDate.getTime() - bDate.getTime();
    }
    if (sortBy === "createdAt") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  return (
    <>
      <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900">
        📝 To-Do List
      </h1>

      <div className="flex items-start flex-col gap-4 mb-6">
        <button
          onClick={handleAdd}
          className="py-2 px-4 bg-white text-black border border-black hover:bg-gray-300 transition cursor-pointer"
        >
          + Add Task
        </button>

        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Filter by status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-400 px-3 py-2 text-sm bg-white text-gray-900"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Sort by
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-400 px-3 py-2 text-sm bg-white text-gray-900"
            >
              <option value="dueDate">Due Date</option>
              <option value="createdAt">Creation Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      <ul>
        {sortedTodos.map((todo) => (
          <li
            key={todo.id}
            className="p-4 border-t border-gray-300 hover:bg-gray-100"
          >
            <a
              href={`/${todo.id}`}
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
                  className="text-black cursor-pointer"
                >
                  <CheckSharpIcon
                    className={
                      todo.isCompleted ? "text-green-600" : "text-white-600"
                    }
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(todo.id);
                  }}
                  className="text-black cursor-pointer"
                >
                  <DeleteIcon className="text-red-600" />
                </button>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
