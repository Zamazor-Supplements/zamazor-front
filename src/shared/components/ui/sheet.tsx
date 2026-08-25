import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SheetSide = "right" | "left";
type SheetSize = "sm" | "md" | "lg" | "xl";

interface SheetProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	side?: SheetSide;
	size?: SheetSize;
	title?: string;
	description?: string;
	children: ReactNode;
}

const SIZE_CLASSES: Record<SheetSize, string> = {
	sm: "sm:max-w-sm",
	md: "sm:max-w-md",
	lg: "sm:max-w-lg",
	xl: "sm:max-w-xl",
};

/**
 * Accessible slide-over panel built on radix Dialog: portals, focus trap,
 * Esc-to-close, body scroll lock and `aria-modal` come for free.
 */
export const Sheet = ({
	open,
	onOpenChange,
	side = "right",
	size = "md",
	title,
	description,
	children,
}: SheetProps) => {
	const isRight = side === "right";

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-50 bg-brand-950/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />

				<Dialog.Content
					className={cn(
						"fixed inset-y-0 z-50 flex w-full flex-col bg-card shadow-lift outline-none",
						"data-[state=open]:animate-in data-[state=closed]:animate-out",
						isRight
							? "right-0 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
							: "left-0 data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
						SIZE_CLASSES[size],
					)}
				>
					{title && (
						<div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
							<Dialog.Title className="font-playfair text-lg font-bold text-ink">
								{title}
							</Dialog.Title>
							<Dialog.Close
								aria-label="Close panel"
								className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-100 text-ink-soft transition-colors hover:bg-slate-50 hover:text-ink cursor-pointer"
							>
								<XIcon className="size-4" />
							</Dialog.Close>
						</div>
					)}

					{/* Radix requires a Dialog.Title for accessible labelling; keep an
					    sr-only one when the consumer renders its own header. */}
					{!title && (
						<Dialog.Title className="sr-only">Panel</Dialog.Title>
					)}

					{description && (
						<Dialog.Description className="sr-only">
							{description}
						</Dialog.Description>
					)}

					{children}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};
