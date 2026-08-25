import { Button } from "@/shared/components/ui/button";
import { QUIZ_ACTIVITIES } from "../../types/quiz";

export const QuizActivityStep = ({
	onSelect,
	onBack,
}: {
	onSelect: (activityId: string) => void;
	onBack: () => void;
}) => (
	<div className="space-y-6">
		<div>
			<span className="text-[10px] font-black uppercase text-brand-800 tracking-wider">
				Step 3 of 3
			</span>
			<h3 className="text-xl font-playfair text-slate-950 font-normal mt-1">
				What is your current physical activity level?
			</h3>
		</div>
		<div className="grid gap-3 sm:grid-cols-3">
			{QUIZ_ACTIVITIES.map((opt) => (
				<button
					key={opt.id}
					onClick={() => onSelect(opt.id)}
					className="p-4 bg-white rounded-2xl border border-brand-900/10 hover:border-brand-700 hover:bg-brand-50/20 text-left transition-all duration-150 cursor-pointer shadow-sm group"
				>
					<p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-brand-800 transition-colors">
						{opt.label}
					</p>
					<p className="text-[11px] text-slate-400 mt-1.5">{opt.desc}</p>
				</button>
			))}
		</div>
		<Button
			variant="ghost"
			onClick={onBack}
			className="text-brand-900 hover:bg-brand-50 rounded-lg cursor-pointer"
		>
			Back
		</Button>
	</div>
);
