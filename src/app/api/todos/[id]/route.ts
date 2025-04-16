import {
  deleteTodo,
  getTodoById,
  patchTodo,
  updateTodo,
} from "@/lib/todos/service";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const todo = await getTodoById(params.id);
  return todo
    ? NextResponse.json(todo)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const updates = await request.json();

  const updatedTodo = await updateTodo(params.id, updates);

  if (!updatedTodo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(updatedTodo);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const updates = await request.json();

  const updatedTodo = await patchTodo(params.id, updates);

  if (!updatedTodo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(updatedTodo);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const deletedTodo = await deleteTodo(params.id);

  if (!deletedTodo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Todo deleted successfully" });
}
