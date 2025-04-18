"use client";

import TodoForm from "@/components/TodoForm";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const TodoPage = () => {
  const router = useRouter();
  const [todo, setTodo] = useState<{
    title: string;
    description: string;
    dueDate: string;
  } | null>(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchTodo = async () => {
        const res = await fetch(`/api/todos/${id}`);
        const data = await res.json();
        setTodo(data);
      };
      fetchTodo();
    }
  }, [id]);

  const handleEditTodo = async (data: {
    title: string;
    description: string;
    dueDate: string;
  }) => {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    router.push(`/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Edit Todo</h1>
      {todo ? (
        <TodoForm
          todo={{ ...todo, id: id as string }}
          onSubmit={handleEditTodo}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TodoPage;
