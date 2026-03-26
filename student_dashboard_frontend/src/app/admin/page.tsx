"use client";

import * as React from "react";
import Link from "next/link";
import { Shield, Users } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { Badge, Card, CardBody, CardHeader, CardTitle } from "@/components/ui";

export default function AdminHomePage() {
  return (
    <RoleGate allow={["admin"]}>
      <DashboardShell
        title="Admin"
        subtitle="Administrative controls for users, roles, and system configuration."
        right={<Badge variant="warning">Admin</Badge>}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <CardTitle>User management</CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-sm text-gray-600">
                Admin user/role management UI will be added here.
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <CardTitle>System</CardTitle>
              </div>
            </CardHeader>
            <CardBody>
              <div className="text-sm text-gray-600">
                System settings and audit tooling will be added here.
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
