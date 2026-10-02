export function fieldAria(description: boolean, error: boolean, id: string) {
  return {
    "aria-describedby": [description && `${id}-description`, error && `${id}-error`].filter(Boolean).join(" ") || undefined,
    "aria-invalid": error || undefined,
  };
}
