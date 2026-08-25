interface ProfileTabsProps {
	activeTab: "profile" | "orders";
	onTabChange: (tab: "profile" | "orders") => void;
}

export const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => (
	<div className="flex justify-center sm:justify-start">
		<div
			role="tablist"
			className="inline-flex p-1 bg-surface-2 rounded-lg border border-brand-900/10/80 gap-1 shadow-2xs"
		>
			<button
				role="tab"
				aria-selected={activeTab === "profile"}
				onClick={() => onTabChange("profile")}
				className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
					activeTab === "profile"
						? "bg-card text-ink shadow-xs font-semibold"
						: "text-ink-soft hover:text-ink hover:bg-surface-2/50"
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
						? "bg-card text-ink shadow-xs font-semibold"
						: "text-ink-soft hover:text-ink hover:bg-surface-2/50"
				}`}
			>
				Order History
			</button>
		</div>
	</div>
);
