import * as React from "react";
import { cn } from "@/lib/cn";

export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <header
      className={cn("flex items-start justify-between gap-4 p-4", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-sm font-semibold text-gray-900", className)}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
}

export function Badge({
  className,
  variant = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "neutral" | "info" | "success" | "warning";
}) {
  const variantClass =
    variant === "info"
      ? "bg-blue-50 text-blue-700 ring-blue-100"
      : variant === "success"
        ? "bg-cyan-50 text-cyan-700 ring-cyan-100"
        : variant === "warning"
          ? "bg-amber-50 text-amber-800 ring-amber-100"
          : "bg-gray-50 text-gray-700 ring-gray-100";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        variantClass,
        className,
      )}
      {...props}
    />
  );
}

export function ProgressBar({
  value,
  label,
}: {
  value: number; // 0..100
  label: string;
}) {
  const safe = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 w-full rounded-full bg-gray-100" aria-hidden="true">
        <div
          className="h-2 rounded-full bg-blue-500"
          style={{ width: `${safe}%` }}
        />
      </div>
      <div className="w-16 text-right text-xs text-gray-600">{label}</div>
    </div>
  );
}
