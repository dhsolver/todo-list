import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoDetail from "./page";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Todo Detail Page", () => {
  let originalFetch: typeof global.fetch;
  const user = userEvent.setup();

  beforeEach(() => {
    originalFetch = global.fetch;
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("renders the Todo Detail page and fetches the todo", async () => {
    const mockTodo = {
      id: "1",
      title: "Test Todo",
      description: "Test Description",
      createdAt: new Date("2025-04-18T10:00:00Z"),
      dueDate: "2025-04-20",
      isCompleted: false,
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockTodo),
    });

    render(<TodoDetail params={{ id: "1" }} />);

    await waitFor(() => {
      expect(screen.getByTestId("todo-title")).toBeInTheDocument();
      expect(screen.getByTestId("todo-title-section")).toHaveTextContent(
        "Test Todo"
      );
      expect(screen.getByTestId("todo-description-section")).toHaveTextContent(
        "Test Description"
      );
      expect(screen.getByTestId("todo-createdAt-section")).toHaveTextContent(
        `Created At:${mockTodo.createdAt.toLocaleString()}`
      );
      expect(screen.getByTestId("todo-dueDate-section")).toHaveTextContent(
        "Due Date:2025-04-20"
      );
      expect(screen.getByTestId("todo-status-section")).toHaveTextContent(
        "Incomplete"
      );
    });
  });

  it("toggles the todo's completion status", async () => {
    const mockTodo = {
      id: "1",
      title: "Test Todo",
      description: "Test Description",
      createdAt: new Date("2025-04-18T10:00:00Z"),
      dueDate: "2025-04-20",
      isCompleted: false,
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockTodo),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
      });

    render(<TodoDetail params={{ id: "1" }} />);

    await waitFor(() => {
      expect(screen.getByTestId("todo-status-section")).toHaveTextContent(
        "Incomplete"
      );
    });

    const toggleButton = screen.getByTestId("toggle-complete-btn");
    await user.click(toggleButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/todos/1", {
        method: "PATCH",
        body: JSON.stringify({ isCompleted: true }),
      });
    });
  });

  it("deletes the todo and redirects to the home page", async () => {
    const mockTodo = {
      id: "1",
      title: "Test Todo",
      description: "Test Description",
      createdAt: new Date("2025-04-18T10:00:00Z"),
      dueDate: "2025-04-20",
      isCompleted: false,
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockTodo),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
      });

    render(<TodoDetail params={{ id: "1" }} />);

    await waitFor(() => {
      expect(screen.getByTestId("todo-title-section")).toHaveTextContent(
        "Test Todo"
      );
    });

    const deleteButton = screen.getByTestId("delete-btn");
    await user.click(deleteButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/todos/1", {
        method: "DELETE",
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});
