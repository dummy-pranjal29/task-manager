"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="py-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Organize Your Tasks with Ease
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A Kanban-style task management application to help you stay
              organized. Create, track, and complete your tasks with a simple
              drag-and-drop interface.
            </p>
            <div className="space-x-4">
              <Link
                href="/signup"
                className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 text-lg"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="bg-white text-blue-600 border border-blue-600 py-3 px-6 rounded-md hover:bg-blue-50 text-lg"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">Create Tasks</h3>
              <p className="text-gray-600">
                Add tasks with titles, descriptions, and due dates
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Kanban Board</h3>
              <p className="text-gray-600">
                Drag and drop tasks between Pending, In Progress, and Completed
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure</h3>
              <p className="text-gray-600">
                Your tasks are private and securely stored
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
