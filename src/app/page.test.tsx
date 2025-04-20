import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./page";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Home Page", () => {
  let originalFetch: typeof global.fetch;
  const user = userEvent.setup();

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue([]),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("renders the Home page with todos", async () => {
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo 1",
        isCompleted: false,
        createdAt: "2025-04-18",
        dueDate: "2025-04-20",
      },
      {
        id: "2",
        title: "Test Todo 2",
        isCompleted: true,
        createdAt: "2025-04-19",
        dueDate: "2025-04-21",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockTodos),
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    });
  });

  it("filters todos by status", async () => {
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo 1",
        isCompleted: false,
        createdAt: "2025-04-18",
        dueDate: "2025-04-20",
      },
      {
        id: "2",
        title: "Test Todo 2",
        isCompleted: true,
        createdAt: "2025-04-19",
        dueDate: "2025-04-21",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockTodos),
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    });

    const filterSelect = screen.getByTestId("filterSelect");
    await user.selectOptions(filterSelect, "completed");

    await waitFor(() => {
      expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
      expect(screen.getByText("Test Todo 2")).toBeInTheDocument();
    });
  });

  it("sorts todos by title", async () => {
    const mockTodos = [
      {
        id: "1",
        title: "B Task",
        isCompleted: false,
        createdAt: "2025-04-18",
        dueDate: "2025-04-20",
      },
      {
        id: "2",
        title: "A Task",
        isCompleted: true,
        createdAt: "2025-04-19",
        dueDate: "2025-04-21",
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockTodos),
    });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("B Task")).toBeInTheDocument();
      expect(screen.getByText("A Task")).toBeInTheDocument();
    });

    const sortSelect = screen.getByTestId("sortSelect");
    await user.selectOptions(sortSelect, "title");

    await waitFor(() => {
      const todos = screen.getAllByRole("listitem");
      expect(todos[0]).toHaveTextContent("A Task");
      expect(todos[1]).toHaveTextContent("B Task");
    });
  });

  it("adds a new task", async () => {
    render(<Home />);

    const addButton = screen.getByTestId("addBtn");
    await user.click(addButton);

    expect(mockPush).toHaveBeenCalledWith("/new");
  });

  it("marks a todo as complete/incomplete", async () => {
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo 1",
        isCompleted: false,
        createdAt: "2025-04-18",
        dueDate: "2025-04-20",
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockTodos),
      })
      .mockResolvedValueOnce({
        json: jest
          .fn()
          .mockResolvedValue([{ ...mockTodos[0], isCompleted: true }]),
      });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    const completeButton = screen.getByTestId("toggleBtn-1");
    await user.click(completeButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/todos/1", {
        method: "PATCH",
        body: JSON.stringify({ isCompleted: true }),
      });
    });
  });

  it("deletes a task", async () => {
    const mockTodos = [
      {
        id: "1",
        title: "Test Todo 1",
        isCompleted: false,
        createdAt: "2025-04-18",
        dueDate: "2025-04-20",
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockTodos),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue([]),
      });

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId("deleteBtn-1");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
    });
  });
});
