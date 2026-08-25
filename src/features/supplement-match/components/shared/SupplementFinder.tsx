import { SupplementRecommendation } from "../results/SupplementRecommendation";

export const SupplementFinder = () => {
	return (
		<section className="bg-[#fcfdfa] py-20 border-b border-brand-900/10">
			<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
				<span className="text-xs font-black uppercase tracking-widest text-brand-800">
					Smart Supplement Finder
				</span>
				<h2 className="mt-3 text-3xl font-playfair font-normal leading-tight text-slate-950 sm:text-4xl">
					Discover your personalized organic supplement stack.
				</h2>
				<p className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
					Take our 30-second science-backed advisor quiz to find the perfect
					clean botanicals and proteins mapped for your activity level.
				</p>

				{/* Quiz Box */}
				<SupplementRecommendation />
			</div>
		</section>
	);
};
