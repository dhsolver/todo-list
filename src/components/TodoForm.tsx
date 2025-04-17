"use client";

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 border border-gray-300"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-3 border border-gray-300"
      />
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition"
      >
        {todo ? "Save Changes" : "Add Task"}
      </button>
    </form>
  );
};

export default TodoForm;
