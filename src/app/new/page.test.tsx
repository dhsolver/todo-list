import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateTodoPage from "./page";

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Create Todo Page", () => {
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

  it("renders the Create Todo page", () => {
    render(<CreateTodoPage />);

    expect(screen.getByText("Create New Todo")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("description")).toBeInTheDocument();
    expect(screen.getByTestId("dueDate")).toBeInTheDocument();
    expect(screen.getByTestId("saveBtn")).toBeInTheDocument();
    expect(screen.getByTestId("cancelBtn")).toBeInTheDocument();
  });

  it("submits the form and redirects to the home page", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({}),
    });

    render(<CreateTodoPage />);

    const titleInput = screen.getByTestId("title");
    const descriptionInput = screen.getByTestId("description");
    const dueDateInput = screen.getByTestId("dueDate");
    const submitButton = screen.getByTestId("saveBtn");

    await user.type(titleInput, "New Todo");
    await user.type(descriptionInput, "This is a new todo");
    await user.type(dueDateInput, "2025-04-25");
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/todos", {
        method: "POST",
        body: JSON.stringify({
          title: "New Todo",
          description: "This is a new todo",
          dueDate: "2025-04-25",
        }),
      });
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });

  it("does not submit the form if the title is empty", async () => {
    render(<CreateTodoPage />);

    const titleInput = screen.getByTestId("title");
    const submitButton = screen.getByTestId("saveBtn");

    await user.type(titleInput, "   "); // Only spaces
    await user.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
