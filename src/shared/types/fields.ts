import type {
	FieldErrors,
	FieldValues,
	Path,
	UseFormRegister,
} from "react-hook-form";

export interface FieldProps<T extends FieldValues> extends Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"name"
> {
	name: Path<T>;
	label?: string;
	register: UseFormRegister<T>;
	errors: FieldErrors<T>;
}

export interface NameFieldProps<T extends FieldValues> extends Omit<
	FieldProps<T>,
	"autoComplete"
> {
	autoComplete?: "name" | "family-name" | "given-name";
}
