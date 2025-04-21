"use server";

import { Todo } from "@prisma/client";
import { prisma } from "../prisma";

type NewTodo = Omit<Todo, "id" | "createdAt" | "isCompleted">;
type UpdateTodo = Partial<Omit<Todo, "id" | "createdAt">>;

export const getTodos = async (): Promise<Todo[]> => {
  return prisma.todo.findMany();
};

export const getTodoById = async (id: string): Promise<Todo | null> => {
  return prisma.todo.findUnique({
    where: { id },
  });
};

export const addTodo = async (todo: NewTodo): Promise<Todo> => {
  return prisma.todo.create({
    data: {
      ...todo,
      createdAt: new Date(),
    },
  });
};

export const updateTodo = async (
  id: string,
  updated: UpdateTodo
): Promise<Todo | null> => {
  const existingTodo = await getTodoById(id);
  if (!existingTodo) return null;

  return prisma.todo.update({
    where: { id },
    data: {
      ...updated,
    },
  });
};

export const patchTodo = async (
  id: string,
  updated: UpdateTodo
): Promise<Todo | null> => {
  const existingTodo = await getTodoById(id);
  if (!existingTodo) return null;

  const updateData = Object.fromEntries(
    Object.entries(updated).filter(
      ([_, value]) => value !== null && value !== undefined // eslint-disable-line @typescript-eslint/no-unused-vars
    )
  );

  return prisma.todo.update({
    where: { id },
    data: {
      ...existingTodo,
      ...updateData,
    },
  });
};

export const deleteTodo = async (id: string): Promise<Todo | null> => {
  const existingTodo = await getTodoById(id);
  if (!existingTodo) return null;

  return prisma.todo.delete({
    where: { id },
  });
};
