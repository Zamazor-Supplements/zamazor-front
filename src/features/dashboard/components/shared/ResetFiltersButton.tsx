import { XIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type ResetFiltersButtonProps = {
	onClick: () => void;
};

export const ResetFiltersButton = ({ onClick }: ResetFiltersButtonProps) => (
	<Button
		variant="ghost"
		onClick={onClick}
		className="h-9.5 shrink-0 gap-1.5 rounded-lg border border-rose-200/80 bg-rose-50/50 px-3 text-xs font-semibold text-rose-600 transition-all hover:bg-rose-100/60 hover:text-rose-700 active:scale-95"
	>
		<XIcon className="size-3.5" />
		Reset
	</Button>
);
