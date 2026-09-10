import {
	DIETS,
	GOALS,
	type GoalId,
	type QuizDiet,
} from "../../config/goalMapping";
import type { Filters } from "../../types/filters";
import { useLanguage } from "@/shared/hooks/use-language";
import { cn } from "@/lib/utils";

interface GoalDietPillsProps {
	filters: Filters;
	onGoalToggle: (goal: GoalId) => void;
	onDietToggle: (diet: QuizDiet) => void;
}

export const GoalDietPills = ({
	filters,
	onGoalToggle,
	onDietToggle,
}: GoalDietPillsProps) => {
	const { t } = useLanguage();

	return (
		<>
			<div className="space-y-2.5">
				<span className="text-xs font-black uppercase tracking-wider text-slate-400">
					{t("shop.goals")}
				</span>
				<div className="flex flex-wrap gap-2">
					{GOALS.map((g) => {
						const isSelected = filters.goal === g.id;
						return (
							<button
								key={g.id}
								type="button"
								aria-pressed={isSelected}
								onClick={() => onGoalToggle(g.id)}
								className={cn(
									"cursor-pointer rounded-lg border px-3.5 py-2 text-xs font-bold transition-all",
									isSelected
										? "border-brand-900 bg-brand-900 text-white shadow-xs"
										: "border-slate-200 bg-white text-slate-700 hover:border-brand-900/30 hover:bg-brand-50/50",
								)}
							>
								{t(g.labelKey)}
							</button>
						);
					})}
				</div>
			</div>

			<div className="space-y-2.5">
				<span className="text-xs font-black uppercase tracking-wider text-slate-400">
					{t("shop.dietary")}
				</span>
				<div className="flex flex-wrap gap-2">
					{DIETS.map((d) => {
						const isSelected = filters.diet === d.id;
						return (
							<button
								key={d.id}
								type="button"
								aria-pressed={isSelected}
								onClick={() => onDietToggle(d.id)}
								className={cn(
									"cursor-pointer rounded-lg border px-3.5 py-2 text-xs font-bold transition-all",
									isSelected
										? "border-brand-900 bg-brand-900 text-white shadow-xs"
										: "border-slate-200 bg-white text-slate-700 hover:border-brand-900/30 hover:bg-brand-50/50",
								)}
							>
								{t(d.labelKey)}
							</button>
						);
					})}
				</div>
				<p className="text-[11px] leading-snug text-slate-400">
					{t("shop.dietaryNote")}
				</p>
			</div>
		</>
	);
};
