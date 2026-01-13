"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = new Date(task.dueDate) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg shadow-md p-4 mb-3 cursor-move hover:shadow-lg transition-shadow ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{task.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>
      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}
      <div className="flex justify-between items-center">
        <span
          className={`text-xs px-2 py-1 rounded ${
            task.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : task.status === "in-progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {task.status === "in-progress" ? "In Progress" : task.status}
        </span>
        <span
          className={`text-xs ${isOverdue ? "text-red-600" : "text-gray-500"}`}
        >
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(task);
        }}
        className="mt-2 w-full text-center text-blue-600 hover:text-blue-800 text-sm"
      >
        Edit
      </button>
    </div>
  );
}
