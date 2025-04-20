import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoForm from "./TodoForm";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      back: () => null,
    };
  },
}));

describe("TodoForm Component", () => {
  const user = userEvent.setup();

  it("renders the TodoForm component", () => {
    render(<TodoForm onSubmit={() => {}} />);
    const titleInput = screen.getByTestId("title");
    const descriptionInput = screen.getByTestId("description");
    const dateInput = screen.getByTestId("dueDate");
    const submitButton = screen.getByTestId("saveBtn");
    const cancelButton = screen.getByTestId("cancelBtn");

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it("submits the form with new task data", async () => {
    const handleSubmit = jest.fn();
    render(<TodoForm onSubmit={handleSubmit} />);

    const titleInput = screen.getByTestId("title");
    const descriptionInput = screen.getByTestId("description");
    const dateInput = screen.getByTestId("dueDate");
    const submitButton = screen.getByTestId("saveBtn");

    await user.type(titleInput, "New Task");
    await user.type(descriptionInput, "Task Description");
    await user.type(dateInput, "2025-04-20");
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "New Task",
      description: "Task Description",
      dueDate: "2025-04-20",
    });
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders with existing task data and allows editing", async () => {
    const handleSubmit = jest.fn();
    const existingTask = {
      id: "1",
      title: "Existing Task",
      description: "Existing Description",
      dueDate: "2025-04-18",
    };

    render(<TodoForm todo={existingTask} onSubmit={handleSubmit} />);

    const titleInput = screen.getByTestId("title");
    const descriptionInput = screen.getByTestId("description");
    const dateInput = screen.getByTestId("dueDate");
    const submitButton = screen.getByTestId("saveBtn");

    expect(titleInput).toHaveValue("Existing Task");
    expect(descriptionInput).toHaveValue("Existing Description");
    expect(dateInput).toHaveValue("2025-04-18");

    await user.clear(titleInput);
    await user.type(titleInput, "Updated Task");
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "Updated Description");
    await user.clear(dateInput);
    await user.type(dateInput, "2025-04-25");
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "Updated Task",
      description: "Updated Description",
      dueDate: "2025-04-25",
    });
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
