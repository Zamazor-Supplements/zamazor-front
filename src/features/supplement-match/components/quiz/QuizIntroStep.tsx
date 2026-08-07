import { Button } from "@/shared/components/ui/button";
import { BrainIcon } from "lucide-react";

export const QuizIntroStep = ({ onStart }: { onStart: () => void }) => (
	<div className="flex flex-col items-center justify-center text-center py-6">
		<BrainIcon className="size-14 text-emerald-800 mb-5 animate-pulse" />
		<h3 className="text-xl font-playfair text-slate-950 font-normal">
			Find Your Clean Formula Match
		</h3>
		<p className="text-slate-500 text-sm max-w-sm mt-3 leading-relaxed">
			Answer three quick questions about your health focus, diet, and activity
			level.
		</p>
		<Button
			onClick={onStart}
			className="mt-8 bg-emerald-900 hover:bg-emerald-950 text-white font-bold h-12 px-8 rounded-full cursor-pointer"
		>
			Start Advisor Quiz
		</Button>
	</div>
);
