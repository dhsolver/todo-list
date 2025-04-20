import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoPage from "./page";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({
    id: "1",
  }),
}));

describe("Edit Todo Page", () => {
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

  it("renders the Edit Todo page and fetches the todo", async () => {
    const mockTodo = {
      id: "1",
      title: "Test Todo",
      description: "Test Description",
      dueDate: "2025-04-20",
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(mockTodo),
    });

    render(<TodoPage />);

    await waitFor(() => {
      expect(screen.getByText("Edit Todo")).toBeInTheDocument();
      expect(screen.getByTestId("title")).toBeInTheDocument();
      expect(screen.getByTestId("description")).toBeInTheDocument();
      expect(screen.getByTestId("dueDate")).toBeInTheDocument();
      expect(screen.getByTestId("saveBtn")).toBeInTheDocument();
      expect(screen.getByTestId("cancelBtn")).toBeInTheDocument();
    });
  });

  it("submits the edited todo and redirects to the todo details page", async () => {
    const mockTodo = {
      id: "1",
      title: "Test Todo",
      description: "Test Description",
      dueDate: "2025-04-20",
    };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue(mockTodo),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({}),
      });

    render(<TodoPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Todo")).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId("title");
    const descriptionInput = screen.getByTestId("description");
    const dueDateInput = screen.getByTestId("dueDate");
    const saveButton = screen.getByTestId("saveBtn");

    await user.clear(titleInput);
    await user.type(titleInput, "Updated Todo");
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated Description");
    await user.clear(dueDateInput);
    await user.type(dueDateInput, "2025-04-25");
    await user.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/todos/1", {
        method: "PUT",
        body: JSON.stringify({
          title: "Updated Todo",
          description: "Updated Description",
          dueDate: "2025-04-25",
        }),
      });
      expect(mockPush).toHaveBeenCalledWith("/1");
    });
  });

  it("shows a loading message while fetching the todo", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue(null),
    });

    render(<TodoPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/todos/1");
    });
  });
});
