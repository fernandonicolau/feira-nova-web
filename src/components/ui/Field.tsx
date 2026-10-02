import type { ReactNode } from "react";
import { Label } from "./Label";

interface FieldProps {
  children: ReactNode;
  description?: string;
  error?: string;
  htmlFor: string;
  label: string;
}

export function Field({ children, description, error, htmlFor, label }: FieldProps) {
  const descriptionId = description ? `${htmlFor}-description` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className="space-y-2">
      <Label className="block" htmlFor={htmlFor}>{label}</Label>
      {children}
      {description && <p className="text-xs leading-5 text-muted-foreground" id={descriptionId}>{description}</p>}
      {error && <p className="text-sm font-medium text-error" id={errorId} role="alert">{error}</p>}
    </div>
  );
}
