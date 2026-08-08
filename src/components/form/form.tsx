"use client";

import { Form as BaseForm } from "@base-ui/react/form";
import type { ComponentProps } from "react";

import { cn } from "../../lib/cn.js";

export type FormProps = ComponentProps<typeof BaseForm>;

/**
 * Form root that collects the validation state of every `Field` inside it.
 *
 * Its reason to exist is `errors`: a map of field `name` to message, which is how a
 * server-side failure reaches the right `FieldError` without any wiring of your own.
 * `Field` alone can only validate what the browser can see.
 *
 * `onFormSubmit` hands you the values already parsed into an object and prevents the
 * native submit for you. Clear a field's entry from `errors` when the user edits it, or
 * the message outlives the mistake.
 *
 * @example
 * const [errors, setErrors] = useState({});
 *
 * <Form
 *   errors={errors}
 *   onFormSubmit={async (values) => setErrors(await save(values))}
 * >
 *   <Field name="email">
 *     <FieldLabel>Work email</FieldLabel>
 *     <Input type="email" required />
 *     <FieldError />
 *   </Field>
 *   <Button type="submit">Save</Button>
 * </Form>
 */
export function Form({ className, ...props }: FormProps) {
  return (
    <BaseForm
      data-slot="form"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}
