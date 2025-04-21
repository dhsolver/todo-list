import { addTodo, getTodos } from "@/lib/todos/service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const sort = searchParams.get("sort") ?? "";
  const filter = searchParams.get("filter") ?? "";
  const res = await getTodos(sort, filter);
  return NextResponse.json(res, { status: 200 });
}

export async function POST(request: Request) {
  const { title, description, dueDate } = await request.json();
  const newTodo = await addTodo({ title, description, dueDate });
  return NextResponse.json(newTodo, { status: 201 });
}
