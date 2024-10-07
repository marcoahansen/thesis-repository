import { FieldErrors } from "react-hook-form";

function inputError(errors: FieldErrors, field: string) {
  return errors[field] && typeof errors[field]?.message === "string"
    ? { message: errors[field]?.message as string }
    : undefined;
}

export { inputError };
