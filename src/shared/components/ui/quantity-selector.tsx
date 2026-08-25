import { Loader2Icon, MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
	value: number;
	onDecrease: () => void;
	onIncrease: () => void;
	disabled?: boolean;
	/** Shows a spinner instead of the number (e.g. while a mutation is pending). */
	isUpdating?: boolean;
	size?: "sm" | "md";
	className?: string;
}

const SIZES = {
	sm: {
		button: "size-7",
		display: "w-8 text-xs",
		icon: "size-3",
		wrap: "p-0.5",
	},
	md: {
		button: "size-9",
		display: "w-12 text-sm",
		icon: "size-3",
		wrap: "p-1",
	},
} as const;

export const QuantitySelector = ({
  value,
  onDecrease,
  onIncrease,
  disabled = false,
  isUpdating = false,
  size = "md",
  className,
}: QuantitySelectorProps) => {
  const s = SIZES[size];

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-brand-900/15 bg-card transition-all shadow-xs",
        s.wrap,
        className,
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
        className={cn(
          "flex items-center justify-center rounded-md font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent",
          s.button,
        )}
      >
        <MinusIcon className={s.icon} />
      </button>

      <div
        className={cn(
          "flex items-center justify-center font-bold text-slate-900 select-none tabular-nums",
          s.display,
        )}
      >
        {isUpdating ? (
          <Loader2Icon className="size-3.5 animate-spin text-brand-800" />
        ) : (
          value
        )}
      </div>

      <button
        type="button"
        onClick={onIncrease}
        disabled={disabled}
        aria-label="Increase quantity"
        className={cn(
          "flex items-center justify-center rounded-md font-bold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent",
          s.button,
        )}
      >
        <PlusIcon className={s.icon} />
      </button>
    </div>
  );
};