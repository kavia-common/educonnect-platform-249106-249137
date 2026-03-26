"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClassName?: string;
};

// PUBLIC_INTERFACE
export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  widthClassName,
}: ModalProps) {
  /** Accessible modal dialog with backdrop. */
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 bg-black/30"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 top-10 mx-auto w-[92vw] max-w-2xl">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            "rounded-2xl border border-gray-200 bg-white shadow-xl",
            widthClassName,
          )}
        >
          <div className="border-b border-gray-100 p-5">
            <div className="text-lg font-semibold text-gray-900">{title}</div>
            {description ? (
              <div className="mt-1 text-sm text-gray-600">{description}</div>
            ) : null}
          </div>

          <div className="p-5">{children}</div>

          {footer ? (
            <div className="flex items-center justify-end gap-2 border-t border-gray-100 p-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
