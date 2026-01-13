"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from "@dnd-kit/core";
import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { createPortal } from "react-dom";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

interface ColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

function Column({
  title,
  tasks,
  status,
  onEditTask,
  onDeleteTask,
}: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-50 rounded-lg p-4 min-h-[400px] ${
        isOver ? "ring-2 ring-blue-400 bg-blue-50" : ""
      }`}
    >
      <h2 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
        {title}
        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </h2>
      <div className="min-h-[200px] flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard({
  tasks,
  onUpdateTaskStatus,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as string;

    if (
      ["pending", "in-progress", "completed"].includes(newStatus) &&
      newStatus !== active.id
    ) {
      onUpdateTaskStatus(taskId, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column
          title="Pending"
          tasks={pendingTasks}
          status="pending"
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
        <Column
          title="In Progress"
          tasks={inProgressTasks}
          status="in-progress"
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
        <Column
          title="Completed"
          tasks={completedTasks}
          status="completed"
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      </div>
      {createPortal(
        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
