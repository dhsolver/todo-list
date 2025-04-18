"use client";

import TodoForm from "@/components/TodoForm";
import { useRouter } from "next/navigation";

const CreateTodoPage = () => {
  const router = useRouter();

  const handleAdd = async (data: {
    title: string;
    description: string;
    dueDate: string;
  }) => {
    if (!data.title.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify(data),
    });

    router.push("/");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Create New Todo
      </h1>
      <TodoForm onSubmit={handleAdd} />
    </div>
  );
};

export default CreateTodoPage;
