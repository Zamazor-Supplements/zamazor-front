"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";

const FILL_DURATION = 0.5;
const FILL_EASE = [0.16, 1, 0.3, 1] as const;

type ButtonHTMLAttributesForMotion = Omit<
	HTMLMotionProps<"button">,
	| "onAnimationEnd"
	| "onAnimationIteration"
	| "onAnimationStart"
	| "onDrag"
	| "onDragEnd"
	| "onDragEnter"
	| "onDragExit"
	| "onDragLeave"
	| "onDragOver"
	| "onDragStart"
	| "onDrop"
>;

function getCoverDiameter(width: number, height: number, x: number, y: number) {
	return Math.ceil(
		2 *
			Math.max(
				Math.hypot(x, y),
				Math.hypot(width - x, y),
				Math.hypot(x, height - y),
				Math.hypot(width - x, height - y),
			),
	);
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
	if (typeof ref === "function") {
		ref(value);
		return;
	}

	if (ref) {
		ref.current = value;
	}
}

function hasTextContent(node: React.ReactNode): boolean {
	if (typeof node === "string" || typeof node === "number") {
		return String(node).trim().length > 0;
	}

	if (Array.isArray(node)) {
		return node.some(hasTextContent);
	}

	if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
		return hasTextContent(node.props.children);
	}

	return false;
}

const buttonVariants = cva(
	"group/button relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-transparent bg-clip-padding font-medium text-[15px] tracking-[-0.02em] transition-all outline-none select-none touch-manipulation cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				emerald:
					"bg-brand-950 text-brand-50 shadow-[inset_0_0_0_1px_#022c22,0_1px_3px_0px_rgba(0,0,0,0.1)]",
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				outline:
					"border-border bg-background hover:bg-muted hover:text-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/85",
				ghost: "hover:bg-muted hover:text-foreground",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				brand:
					"bg-brand-900 text-white shadow-sm shadow-brand-900/20 hover:bg-brand-950",
				soft: "bg-brand-50 text-brand-900 hover:bg-brand-100",
			},
			size: {
				default: "h-12 px-8 gap-2",
				sm: "h-9 px-4 text-sm gap-1.5",
				lg: "h-14 px-10 text-base gap-2.5",
				icon: "size-10",
			},
		},
		defaultVariants: {
			variant: "emerald",
			size: "default",
		},
	},
);

type OriginButtonProps = ButtonHTMLAttributesForMotion &
	VariantProps<typeof buttonVariants> & {
		children?: React.ReactNode;
		loading?: boolean;
	};

const OriginButton = React.forwardRef<HTMLButtonElement, OriginButtonProps>(
	(
		{
			children,
			className,
			disabled = false,
			loading = false,
			type = "button",
			variant = "emerald",
			size = "default",
			onBlur,
			onClick,
			onFocus,
			onKeyDown,
			onKeyUp,
			onPointerCancel,
			onPointerDown,
			onPointerEnter,
			onPointerLeave,
			onPointerUp,
			...props
		},
		ref,
	) => {
		const buttonRef = React.useRef<HTMLButtonElement>(null);
		const isDisabled = Boolean(disabled || loading);
		const [hovered, setHovered] = React.useState(false);
		const [isPressed, setIsPressed] = React.useState(false);
		const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
		const [coverSize, setCoverSize] = React.useState(0);

		const isEmerald = variant === "emerald";
		const showFill = !isDisabled && (hovered || isPressed);

		const ariaLabel = props["aria-label"];
		const ariaLabelledBy = props["aria-labelledby"];

		React.useEffect(() => {
			if (import.meta.env?.PROD) return;
			if (
				hasTextContent(children) ||
				ariaLabel?.trim() ||
				ariaLabelledBy?.trim()
			)
				return;

			console.warn(
				"OriginButton: provide visible label text or aria-label / aria-labelledby so the control has an accessible name.",
			);
		}, [ariaLabel, ariaLabelledBy, children]);

		const updateOrigin = React.useCallback((x: number, y: number) => {
			const node = buttonRef.current;
			if (!node) return;

			const rect = node.getBoundingClientRect();
			setOrigin({ x, y });
			setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
		}, []);

		const updateOriginFromPointer = React.useCallback(
			(event: React.PointerEvent<HTMLButtonElement>) => {
				const rect = event.currentTarget.getBoundingClientRect();
				updateOrigin(event.clientX - rect.left, event.clientY - rect.top);
			},
			[updateOrigin],
		);

		const updateOriginFromCenter = React.useCallback(() => {
			const node = buttonRef.current;
			if (!node) return;

			const rect = node.getBoundingClientRect();
			updateOrigin(rect.width / 2, rect.height / 2);
		}, [updateOrigin]);

		React.useLayoutEffect(() => {
			const node = buttonRef.current;
			if (!(node && showFill)) return;

			const measure = () => {
				const rect = node.getBoundingClientRect();
				setCoverSize(
					getCoverDiameter(rect.width, rect.height, origin.x, origin.y),
				);
			};

			measure();

			const observer = new ResizeObserver(measure);
			observer.observe(node);

			return () => observer.disconnect();
		}, [showFill, origin.x, origin.y]);

		const setMergedRef = React.useCallback(
			(node: HTMLButtonElement | null) => {
				buttonRef.current = node;
				assignRef(ref, node);
			},
			[ref],
		);

		return (
			<motion.button
				{...props}
				ref={setMergedRef}
				type={type}
				disabled={isDisabled}
				aria-busy={loading || undefined}
				className={cn(
					buttonVariants({ variant, size }),
					showFill &&
						isEmerald &&
						"shadow-[inset_0_0_0_1px_var(--color-lime-300),0_8px_20px_rgba(190,242,100,0.35)] text-brand-950 font-black",
					className,
				)}
				data-pressed={isPressed ? "true" : "false"}
				onBlur={(event) => {
					onBlur?.(event);
					setIsPressed(false);
					if (!event.defaultPrevented) setHovered(false);
				}}
				onClick={onClick}
				onFocus={(event) => {
					onFocus?.(event);
					if (isDisabled || event.defaultPrevented) return;
					if (event.currentTarget.matches(":focus-visible")) {
						updateOriginFromCenter();
						setHovered(true);
					}
				}}
				onKeyDown={(event) => {
					onKeyDown?.(event);

					if (
						event.defaultPrevented ||
						isDisabled ||
						event.repeat ||
						(event.key !== " " && event.key !== "Enter")
					) {
						return;
					}
					if (event.key === " ") event.preventDefault();
					updateOriginFromCenter();
					setIsPressed(true);
					setHovered(true);
				}}
				onKeyUp={(event) => {
					onKeyUp?.(event);

					if (event.key === " " || event.key === "Enter") {
						setIsPressed(false);
						if (!event.currentTarget.matches(":focus-visible"))
							setHovered(false);
					}
				}}
				onPointerCancel={(event) => {
					onPointerCancel?.(event);
					setIsPressed(false);
				}}
				onPointerDown={(event) => {
					onPointerDown?.(event);

					if (event.defaultPrevented || isDisabled || event.button !== 0) {
						return;
					}

					updateOriginFromPointer(event);
					setIsPressed(true);
					setHovered(true);
				}}
				onPointerEnter={(event) => {
					onPointerEnter?.(event);
					if (isDisabled || event.defaultPrevented) return;
					updateOriginFromPointer(event);
					setHovered(true);
				}}
				onPointerLeave={(event) => {
					onPointerLeave?.(event);
					setHovered(false);
					setIsPressed(false);
				}}
				onPointerUp={(event) => {
					onPointerUp?.(event);
					setIsPressed(false);
				}}
				{...(!isDisabled && { whileTap: { scale: 0.985 } })}
			>
				<motion.span
					aria-hidden
					initial={{ scale: 0 }}
					animate={{ scale: showFill && coverSize > 0 ? 1 : 0 }}
					transition={{ duration: FILL_DURATION, ease: FILL_EASE }}
					className={cn(
						"pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full",
						isEmerald && "bg-lime-300",
					)}
					style={{
						height: coverSize,
						width: coverSize,
						left: origin.x,
						top: origin.y,
						transformOrigin: "center",
					}}
				/>
				<span className="relative z-10 inline-flex items-center justify-center gap-2">
					{loading && (
						<Loader2Icon className="size-4 animate-spin text-lime-300 shrink-0" />
					)}
					<span className="relative z-10 inline-flex flex-row items-center justify-center gap-2 whitespace-nowrap">
						{children}
					</span>
				</span>
			</motion.button>
		);
	},
);
OriginButton.displayName = "OriginButton";

export { OriginButton };
