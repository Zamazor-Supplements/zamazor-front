import { cn } from "@/lib/utils";
import { QUIZ_DIETS } from "../../types/quiz";
import { Button } from "@/shared/components/ui/button";

export const QuizDietStep = ({
	selectedDiet,
	onSelect,
	onBack,
}: {
	selectedDiet: string;
	onSelect: (dietId: string) => void;
	onBack: () => void;
}) => (
	<div className="space-y-6">
		<div>
			<span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
				Step 2 of 3
			</span>
			<h3 className="text-xl font-playfair text-slate-950 font-normal mt-1">
				Select your primary dietary preference:
			</h3>
		</div>
		<div className="grid gap-3 sm:grid-cols-2">
			{QUIZ_DIETS.map((opt) => {
				const isSelected = selectedDiet === opt.id;
				return (
					<button
						key={opt.id}
						onClick={() => onSelect(opt.id)}
						className={cn(
							"p-4 rounded-2xl border text-left transition-all duration-150 cursor-pointer shadow-sm",
							isSelected
								? "bg-emerald-900 border-emerald-900"
								: "bg-white border-emerald-900/10 hover:border-emerald-700 hover:bg-emerald-50/20",
						)}
					>
						<p
							className={cn(
								"text-sm font-bold leading-tight",
								isSelected ? "text-white" : "text-slate-900",
							)}
						>
							{opt.label}
						</p>
						<p
							className={cn(
								"text-[11px] mt-1",
								isSelected ? "text-emerald-100" : "text-slate-400",
							)}
						>
							{opt.desc}
						</p>
					</button>
				);
			})}
		</div>
		<Button
			variant="ghost"
			onClick={onBack}
			className="text-emerald-900 hover:bg-emerald-50 rounded-xl cursor-pointer"
		>
			Back
		</Button>
	</div>
);
