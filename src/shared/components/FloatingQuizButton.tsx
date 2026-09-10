import { useState } from "react";
import { Sparkles } from "lucide-react";
import { SupplementQuiz } from "../../features/supplement-match/components/quiz/SupplementQuiz";

export const FloatingQuizButton = () => {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* Floating Button */}
			<div className="fixed bottom-6 right-6 z-9998 flex flex-col items-end gap-2 group">
				{/* Tooltip label */}
				<div className="hidden group-hover:flex items-center gap-2 bg-brand-950 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap transition-all">
					<Sparkles className="size-3 text-lime-300" />
					Supplement Advisor Quiz
				</div>
				<button
					onClick={() => setOpen(true)}
					aria-label="Open Supplement Advisor Quiz"
					className="relative flex items-center justify-center size-14 rounded-full bg-brand-900 hover:bg-brand-950 text-white shadow-xl shadow-brand-900/30 hover:shadow-brand-900/50 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-brand-700/30"
				>
					{/* Ping animation ring */}
					<span className="absolute inset-0 rounded-full bg-brand-400/20 animate-ping" />
					<Sparkles className="size-6 relative z-10" />
				</button>
			</div>

			{/* Modal */}
			{open && <SupplementQuiz onClose={() => setOpen(false)} />}
		</>
	);
};
