import { QUIZ_FOCUSES, type QuizFocus } from "../../types/quiz";

export const QuizFocusStep = ({
	onSelect,
}: {
	onSelect: (focus: QuizFocus) => void;
}) => (
	<div className="space-y-6">
		<div>
			<span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
				Step 1 of 3
			</span>
			<h3 className="text-xl font-playfair text-slate-950 font-normal mt-1">
				What is your primary wellness or fitness focus?
			</h3>
		</div>
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{QUIZ_FOCUSES.map((opt) => {
				const Icon = opt.icon;
				return (
					<button
						key={opt.id}
						onClick={() => onSelect(opt.id as QuizFocus)}
						className="p-4 bg-white rounded-2xl border border-emerald-900/10 hover:border-emerald-700 hover:bg-emerald-50/20 text-left transition-all duration-150 cursor-pointer group shadow-sm hover:shadow-md"
					>
						{Icon && (
							<Icon className="size-6 text-emerald-800 mb-3 group-hover:scale-110 transition-transform" />
						)}
						<p className="text-sm font-bold text-slate-900 leading-tight">
							{opt.label}
						</p>
						<p className="text-[11px] text-slate-400 mt-1">{opt.desc}</p>
					</button>
				);
			})}
		</div>
	</div>
);
