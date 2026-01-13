import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateTaskSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .optional(),
});

async function getTaskAndVerifyOwnership(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    return { task: null, error: "Task not found", status: 404 };
  }

  if (task.userId !== userId) {
    return { task: null, error: "Unauthorized", status: 401 };
  }

  return { task, error: null, status: 200 };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { task, error, status } = await getTaskAndVerifyOwnership(
      id,
      session.user.id
    );

    if (error || !task) {
      return NextResponse.json({ error }, { status });
    }

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { task, error, status } = await getTaskAndVerifyOwnership(
      id,
      session.user.id
    );

    if (error || !task) {
      return NextResponse.json({ error }, { status });
    }

    const body = await request.json();
    const validatedData = updateTaskSchema.parse(body);

    const updateData: {
      title?: string;
      description?: string;
      status?: string;
      dueDate?: Date;
    } = {};

    if (validatedData.title !== undefined)
      updateData.title = validatedData.title;
    if (validatedData.description !== undefined)
      updateData.description = validatedData.description;
    if (validatedData.status !== undefined)
      updateData.status = validatedData.status;
    if (validatedData.dueDate !== undefined)
      updateData.dueDate = new Date(validatedData.dueDate);

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ message: "Task updated", task: updatedTask });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as { errors?: Array<{ message?: string }> };
      const firstError = zodError.errors?.[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation error" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { task, error, status } = await getTaskAndVerifyOwnership(
      id,
      session.user.id
    );

    if (error || !task) {
      return NextResponse.json({ error }, { status });
    }

    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
