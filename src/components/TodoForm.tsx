"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface TodoFormProps {
  todo?: { id: string; title: string; description: string; dueDate: string };
  onSubmit: (data: {
    title: string;
    description: string;
    dueDate: string;
  }) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todo, onSubmit }) => {
  const [title, setTitle] = useState(todo?.title || "");
  const [description, setDescription] = useState(todo?.description || "");
  const [dueDate, setDueDate] = useState(todo?.dueDate || "");
  const router = useRouter();

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setDueDate(todo.dueDate);
    }
  }, [todo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, dueDate });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border border-gray-300"
        rows={6}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-3 border border-gray-300"
      />
      <div className="flex items-center justify-between mb-4">
        <button
          type="submit"
          className="w-1/2 mr-2 py-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition cursor-pointer"
        >
          {todo ? "Save Changes" : "Add Task"}
        </button>
        <button
          type="button"
          className="w-1/2 ml-2 py-2 text-black border border-black-600 hover:bg-gray-300 transition cursor-pointer"
          onClick={onCancel}
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
