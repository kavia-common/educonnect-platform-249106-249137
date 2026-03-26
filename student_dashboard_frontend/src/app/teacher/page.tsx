"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, NotebookPen } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { Badge, Card, CardBody, CardHeader, CardTitle } from "@/components/ui";

export default function TeacherHomePage() {
  return (
    <RoleGate allow={["teacher", "admin"]}>
      <DashboardShell
        title="Teacher"
        subtitle="Manage your teaching workflow: courses, assignments, and announcements."
        right={<Badge variant="info">Teacher</Badge>}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <CardTitle>Courses</CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-sm text-gray-600">
                Teacher course management UI will be added here.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-blue-600" />
                <CardTitle>Assignments</CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-sm text-gray-600">
                Create/grade assignments once teacher endpoints are available.
              </div>
              <div className="mt-4">
                <Link className="text-sm text-blue-700 hover:underline" href="/">
                  Back to dashboard
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </DashboardShell>
    </RoleGate>
  );
}
