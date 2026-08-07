import { Input } from "@/shared/components/ui/input";
import { useId } from "react";
import type { FieldValues } from "react-hook-form";
import { Mail } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import type { FieldProps } from "@/shared/types/fields";

export const EmailField = <T extends FieldValues>({
	name,
	label,
	placeholder = "john@doe.com",
	autoComplete = "email",
	register,
	errors,
	disabled,
	className,
	...rest
}: FieldProps<T>) => {
	const baseId = useId();

	const inputId = `${baseId}-${name}`;
	const errorId = `${baseId}-${name}-error`;
	const fieldError = errors[name];

	return (
		<Field className="space-y-1.5">
			{label && (
				<FieldLabel
					htmlFor={inputId}
					className="block text-xs font-semibold text-slate-700"
				>
					{label}
				</FieldLabel>
			)}

			<div className="relative">
				<Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />

				<Input
					id={inputId}
					{...register(name)}
					{...rest}
					type="email"
					placeholder={placeholder}
					autoComplete={autoComplete}
					disabled={disabled}
					aria-invalid={!!fieldError}
					aria-required="true"
					aria-describedby={fieldError ? errorId : undefined}
					className={`pl-10 ${className || ""}`}
				/>
			</div>

			{fieldError && (
				<FieldError id={errorId} className="text-xs text-red-600 font-medium">
					{fieldError.message as string}
				</FieldError>
			)}
		</Field>
	);
};
