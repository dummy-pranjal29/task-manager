import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereClause: { userId: string; status?: string } = {
      userId: session.user.id,
    };

    if (status && ["pending", "in-progress", "completed"].includes(status)) {
      whereClause.status = status;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
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

    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, dueDate } = taskSchema.parse(body);

    const task = await prisma.task.create({
      data: {
        title,
        description: description || "",
        dueDate: new Date(dueDate),
        status: "pending",
        userId: session.user.id,
      },
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

    return NextResponse.json(
      { message: "Task created", task },
      { status: 201 }
    );
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
