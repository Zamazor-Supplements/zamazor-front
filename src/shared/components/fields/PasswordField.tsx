import { Input } from "@/shared/components/ui/input";
import { useId, useState } from "react";
import type {
	FieldValues,
} from "react-hook-form";
import { EyeIcon, EyeOffIcon, Lock } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import type { FieldProps } from "@/shared/types/fields";

export const PasswordField = <T extends FieldValues>({
	name,
	label,
	placeholder = "secret1234@",
	autoComplete = "current-password",
	register,
	errors,
	disabled,
	className,
	...rest
}: FieldProps<T>) => {
	const [showPassword, setShowPassword] = useState(false);
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
				<Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />

				<Input
					id={inputId}
					{...register(name)}
					{...rest}
					type={showPassword ? "text" : "password"}
					placeholder={placeholder}
					autoComplete={autoComplete}
					disabled={disabled}
					aria-invalid={!!fieldError}
					aria-required="true"
					aria-describedby={fieldError ? errorId : undefined}
					className={`pl-10 pr-10 ${className || ""}`}
				/>

				<button
					type="button"
					disabled={disabled}
					onClick={() => setShowPassword((prev) => !prev)}
					aria-label={
						showPassword
							? `Hide ${label ? label.toLowerCase() : "password"}`
							: `Show ${label ? label.toLowerCase() : "password"}`
					}
					className="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
				</button>
			</div>

			{fieldError && (
				<FieldError id={errorId} className="text-xs text-red-600 font-medium">
					{fieldError.message as string}
				</FieldError>
			)}
		</Field>
	);
};
