import { prisma } from "../prisma";
import {
  getTodos,
  getTodoById,
  addTodo,
  updateTodo,
  patchTodo,
  deleteTodo,
} from "./service";

jest.mock("../prisma", () => ({
  prisma: {
    todo: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("Todo Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTodos", () => {
    it("should fetch all todos", async () => {
      const mockTodos = [{ id: "1", title: "Test Todo" }];
      (prisma.todo.findMany as jest.Mock).mockResolvedValue(mockTodos);

      const todos = await getTodos();
      expect(prisma.todo.findMany).toHaveBeenCalledTimes(1);
      expect(todos).toEqual(mockTodos);
    });
  });

  describe("getTodoById", () => {
    it("should fetch a todo by ID", async () => {
      const mockTodo = { id: "1", title: "Test Todo" };
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(mockTodo);

      const todo = await getTodoById("1");
      expect(prisma.todo.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(todo).toEqual(mockTodo);
    });

    it("should return null if todo is not found", async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(null);

      const todo = await getTodoById("1");
      expect(todo).toBeNull();
    });
  });

  describe("addTodo", () => {
    it("should add a new todo", async () => {
      const newTodo = {
        title: "New Todo",
        description: "Test",
        dueDate: "2025-04-20",
      };
      const mockCreatedTodo = { id: "1", ...newTodo, createdAt: new Date() };
      (prisma.todo.create as jest.Mock).mockResolvedValue(mockCreatedTodo);

      const todo = await addTodo(newTodo);
      expect(prisma.todo.create).toHaveBeenCalledWith({
        data: { ...newTodo, createdAt: expect.any(Date) },
      });
      expect(todo).toEqual(mockCreatedTodo);
    });
  });

  describe("updateTodo", () => {
    it("should update an existing todo", async () => {
      const updatedData = { title: "Updated Todo" };
      const mockExistingTodo = { id: "1", title: "Old Todo" };
      const mockUpdatedTodo = { ...mockExistingTodo, ...updatedData };
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(mockExistingTodo);
      (prisma.todo.update as jest.Mock).mockResolvedValue(mockUpdatedTodo);

      const todo = await updateTodo("1", updatedData);
      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: updatedData,
      });
      expect(todo).toEqual(mockUpdatedTodo);
    });

    it("should return null if todo does not exist", async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(null);

      const todo = await updateTodo("1", { title: "Updated Todo" });
      expect(todo).toBeNull();
    });
  });

  describe("patchTodo", () => {
    it("should patch an existing todo", async () => {
      const updatedData = { title: "Patched Todo" };
      const mockExistingTodo = { id: "1", title: "Old Todo" };
      const mockPatchedTodo = { ...mockExistingTodo, ...updatedData };
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(mockExistingTodo);
      (prisma.todo.update as jest.Mock).mockResolvedValue(mockPatchedTodo);

      const todo = await patchTodo("1", updatedData);
      expect(prisma.todo.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { ...mockExistingTodo, ...updatedData },
      });
      expect(todo).toEqual(mockPatchedTodo);
    });

    it("should return null if todo does not exist", async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(null);

      const todo = await patchTodo("1", { title: "Patched Todo" });
      expect(todo).toBeNull();
    });
  });

  describe("deleteTodo", () => {
    it("should delete an existing todo", async () => {
      const mockExistingTodo = { id: "1", title: "Test Todo" };
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(mockExistingTodo);
      (prisma.todo.delete as jest.Mock).mockResolvedValue(mockExistingTodo);

      const todo = await deleteTodo("1");
      expect(prisma.todo.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(todo).toEqual(mockExistingTodo);
    });

    it("should return null if todo does not exist", async () => {
      (prisma.todo.findUnique as jest.Mock).mockResolvedValue(null);

      const todo = await deleteTodo("1");
      expect(todo).toBeNull();
    });
  });
});
