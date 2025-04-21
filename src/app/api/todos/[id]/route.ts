import {
  deleteTodo,
  getTodoById,
  patchTodo,
  updateTodo,
} from "@/lib/todos/service";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const todo = await getTodoById(id);
  return todo
    ? NextResponse.json(todo)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates = await request.json();

  const updatedTodo = await updateTodo(id, updates);

  if (!updatedTodo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(updatedTodo);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updates = await request.json();

  const updatedTodo = await patchTodo(id, updates);

  if (!updatedTodo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(updatedTodo);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deletedTodo = await deleteTodo(id);

  if (!deletedTodo) {
    return NextResponse.json({ message: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Todo deleted successfully" });
}
