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
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>(
    {}
  );
  const router = useRouter();

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setDueDate(todo.dueDate);
    }
  }, [todo]);

  const validate = () => {
    const newErrors: { title?: string; dueDate?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }
    if (!dueDate.trim()) {
      newErrors.dueDate = "Due date is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title, description, dueDate });
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          data-testid="title"
          type="text"
          placeholder="Title"
          value={title}
          required
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full p-3 border ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p data-testid="title-error" className="text-red-500 text-sm mt-1">
            {errors.title}
          </p>
        )}
      </div>
      <div>
        <textarea
          data-testid="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300"
          rows={6}
        />
      </div>
      <div>
        <input
          data-testid="dueDate"
          type="date"
          value={dueDate}
          required
          onChange={(e) => setDueDate(e.target.value)}
          className={`w-full p-3 border ${
            errors.dueDate ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.dueDate && (
          <p data-testid="dueDate-error" className="text-red-500 text-sm mt-1">
            {errors.dueDate}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between mb-4">
        <button
          data-testid="saveBtn"
          type="submit"
          className="w-1/2 mr-2 py-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 transition cursor-pointer"
        >
          {todo ? "Save Changes" : "Add Task"}
        </button>
        <button
          data-testid="cancelBtn"
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
