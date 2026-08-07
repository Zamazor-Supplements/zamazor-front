interface ProfileTabsProps {
	activeTab: "profile" | "orders";
	onTabChange: (tab: "profile" | "orders") => void;
}

export const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => (
	<div className="flex justify-center sm:justify-start">
		<div
			role="tablist"
			className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/80 gap-1 shadow-2xs"
		>
			<button
				role="tab"
				aria-selected={activeTab === "profile"}
				onClick={() => onTabChange("profile")}
				className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
					activeTab === "profile"
						? "bg-white text-slate-900 shadow-xs font-semibold"
						: "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
				}`}
			>
				Profile & Address
			</button>
			<button
				role="tab"
				aria-selected={activeTab === "orders"}
				onClick={() => onTabChange("orders")}
				className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
					activeTab === "orders"
						? "bg-white text-slate-900 shadow-xs font-semibold"
						: "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
				}`}
			>
				Order History
			</button>
		</div>
	</div>
);
