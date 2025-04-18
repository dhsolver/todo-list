"use client";

import { Todo } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function TodoDetail({ params }: { params: { id: string } }) {
  const [todo, setTodo] = useState<Todo | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    const res = await fetch(`/api/todos/${params.id}`);
    const data = await res.json();
    setTodo(data);
  };

  const toggleComplete = async () => {
    if (todo) {
      const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
      await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          isCompleted: updatedTodo.isCompleted,
        }),
      });
      setTodo(updatedTodo);
    }
  };

  const handleDelete = async () => {
    if (todo) {
      await fetch(`/api/todos/${todo.id}`, { method: "DELETE" });
      router.push("/");
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleEdit = () => {
    router.push(`/${todo?.id}/edit`);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {todo ? (
        <>
          <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
            Todo Details
          </h1>

          <div className="mb-4">
            <strong className="text-xl">Title:</strong>
            <p>{todo.title}</p>
          </div>

          <div className="mb-4">
            <strong className="text-xl">Description:</strong>
            <p>{todo.description || "No description available"}</p>
          </div>

          <div className="mb-4">
            <strong className="text-xl">Created At:</strong>
            <p>{todo.createdAt.toLocaleString()}</p>
          </div>

          <div className="mb-4">
            <strong className="text-xl">Due Date:</strong>
            <p>{todo.dueDate || "No due date"}</p>
          </div>

          <div className="mb-6">
            <strong className="text-xl">Status:</strong>
            <p
              className={`text-xl ${
                todo.isCompleted ? "text-green-600" : "text-red-600"
              }`}
            >
              {todo.isCompleted ? "Completed" : "Incomplete"}
            </p>
          </div>

          <div className="space-x-2">
            <button
              onClick={toggleComplete}
              className={`p-2 px-4 border border-gray-300 cursor-pointer hover:bg-gray-100`}
            >
              {todo.isCompleted ? (
                <CheckSharpIcon className="text-green-600" />
              ) : (
                <CheckSharpIcon className="text-white-600" />
              )}
            </button>

            <button
              onClick={handleDelete}
              className="p-2 px-4 border border-gray-300 cursor-pointer hover:bg-gray-100"
            >
              <DeleteIcon className="text-red-600 hover:text-red-800" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 px-4 border border-gray-300 cursor-pointer hover:bg-gray-100"
            >
              <EditIcon className="text-black hover:text-gray-600" />
            </button>

            <button
              onClick={handleBack}
              className="p-2 px-4 border border-gray-300 cursor-pointer hover:bg-gray-100"
            >
              <ArrowBackIcon className="text-black hover:text-gray-600" />
            </button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
