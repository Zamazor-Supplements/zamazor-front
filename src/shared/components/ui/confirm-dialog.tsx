import { AlertTriangleIcon, InfoIcon, Loader2Icon } from "lucide-react";
import { Button } from "./button";
import { useEffect, useId } from "react";

interface ConfirmDialogProps {
	isOpen: boolean;
	title: string;
	description: string;
	confirmText?: string;
	cancelText?: string;
	isDestructive?: boolean;
	isLoading: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

export const ConfirmDialog = ({
	isOpen,
	title,
	description,
	confirmText = "Continue",
	cancelText = "Cancel",
	isDestructive = false,
	isLoading = false,
	onConfirm,
	onClose,
}: ConfirmDialogProps) => {
	const titleId = useId();
	const descriptionId = useId();

	// Close modal on Escape key press + scroll lock
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && !isLoading) {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = prev;
		};
	}, [isOpen, isLoading, onClose]);

	if (!isOpen) return null;

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby={titleId}
			aria-describedby={descriptionId}
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
		>
			{/* Backdrop Click */}
			<div
				className="absolute inset-0"
				onClick={() => !isLoading && onClose()}
			/>

			{/* Dialog Body */}
			<div className="relative w-full max-w-md bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 animate-in zoom-in-95 duration-200 flex flex-col gap-5">
				<div className="flex items-start gap-4">
					{/* Status Icon */}
					<div
						className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${
							isDestructive
								? "border-rose-200 bg-rose-50 text-rose-600"
								: "border-slate-200 bg-slate-50 text-slate-700"
						}`}
					>
						{isDestructive ? (
							<AlertTriangleIcon className="size-5" />
						) : (
							<InfoIcon className="size-5" />
						)}
					</div>

					{/* Text Content */}
					<div className="space-y-1.5 flex-1 min-w-0">
						<h3
							id={titleId}
							className="text-base font-semibold text-slate-900 leading-tight"
						>
							{title}
						</h3>
						<div
							id={descriptionId}
							className="text-xs text-slate-500 leading-relaxed"
						>
							{description}
						</div>
					</div>
				</div>

				{/* Action Controls */}
				<div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
					<Button
						type="button"
						variant="outline"
						disabled={isLoading}
						onClick={onClose}
						className="h-9 px-4 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
					>
						{cancelText}
					</Button>

					<Button
						type="button"
						variant={isDestructive ? "destructive" : "default"}
						disabled={isLoading}
						onClick={async () => {
							await onConfirm();
							// Since state updates happen asynchronously, 
							// checking the current prop directly inside the handler works fine here
						}}
						className={`h-9 px-4 rounded-lg text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 ${
							isDestructive
								? "bg-rose-600 hover:bg-rose-700 text-white"
								: "bg-slate-900 hover:bg-slate-950 text-white"
						}`}
					>
						{isLoading && (
							<Loader2Icon className="mr-1.5 size-3.5 animate-spin" />
						)}
						{confirmText}
					</Button>
				</div>
			</div>
		</div>
	);
};
