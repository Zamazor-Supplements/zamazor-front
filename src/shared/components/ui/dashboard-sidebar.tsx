import { useId, useState } from "react";
import {
	LayoutDashboardIcon,
	FolderKanbanIcon,
	TagsIcon,
	LogOutIcon,
	ChevronRightIcon,
	InboxIcon,
	type LucideIcon,
	User2Icon,
	HomeIcon,
} from "lucide-react";
import { NavLink, useLocation } from "react-router";
import { APP_ROUTES } from "@/app/routes/paths";
import { cn } from "@/lib/utils";

export type NavLeafItem = {
	title: string;
	to: string;
	icon: LucideIcon;
	badge?: number | string;
	shortcut?: string;
	end: boolean;
};

export type NavActionItem = {
	title: string;
	icon: LucideIcon;
	onClick: () => void;
	variant?: "danger" | "default";
};

export type NavParentItem = {
	title: string;
	icon: LucideIcon;
	children: NavLeafItem[];
};

export type NavItemData = NavLeafItem | NavParentItem | NavActionItem;

type NavGroupData = {
	heading?: string;
	items: NavItemData[];
};

// Type Guards
const isParentItem = (item: NavItemData): item is NavParentItem =>
	"children" in item && Array.isArray(item.children);

const isActionItem = (item: NavItemData): item is NavActionItem =>
	"onClick" in item;

const NAV_GROUPS: NavGroupData[] = [
	{
		heading: "Management",
		items: [
			{
				title: "Overview",
				to: APP_ROUTES.DASHBOARD.ROOT,
				icon: LayoutDashboardIcon,
				end: true,
			},
			{
				title: "Products",
				to: APP_ROUTES.DASHBOARD.PRODUCTS,
				icon: FolderKanbanIcon,
				end: false,
			},
			{
				title: "Categories",
				to: APP_ROUTES.DASHBOARD.CATEGORIES,
				icon: TagsIcon,
				end: false,
			},
			{
				title: "Orders",
				to: APP_ROUTES.DASHBOARD.ORDERS,
				icon: InboxIcon,
				badge: 3,
				end: false,
			},
		],
	},
];

const getBottomItems = (onLogout: () => void): NavItemData[] => [
	{
		title: "Profile",
		to: APP_ROUTES.USER.PROFILE,
		icon: User2Icon,
		end: false,
	},
	{
		title: "Storefront",
		to: APP_ROUTES.HOME,
		icon: HomeIcon,
		end: false,
	},
	{
		title: "Log out",
		icon: LogOutIcon,
		onClick: onLogout,
		variant: "danger",
	},
];

function WorkspaceSwitcher({
	selected = "Zamazor Store",
}: {
	selected: string | undefined;
}) {
	return (
		<div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-100/50 bg-slate-50/50 px-2.5 py-2 select-none">
			<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-900 text-[13px] font-bold text-white shadow-xs">
				{selected.charAt(0)}
			</div>
			<div className="flex flex-col overflow-hidden">
				<span className="max-w-37.5 truncate text-[13px] font-bold leading-none text-slate-900">
					{selected}
				</span>
				<span className="mt-1 text-[10px] font-medium leading-none text-slate-500">
					Admin Desk
				</span>
			</div>
		</div>
	);
}

function NavItem({
	item,
	onNavClick,
	level = 0,
}: {
	item: NavItemData;
	onNavClick: () => void;
	level?: number;
}) {
	const location = useLocation();
	const submenuId = useId();

	// Auto-expand parent if any child route is currently active
	const hasActiveChild =
		isParentItem(item) &&
		item.children.some((child) => location.pathname.startsWith(child.to));

	const [isOpen, setIsOpen] = useState(hasActiveChild);

	const paddingLeft = `${level * 12 + 12}px`;

	// Case 1: Action Button (e.g., Logout)
	if (isActionItem(item)) {
		const isDanger = item.variant === "danger";
		return (
			<button
				type="button"
				style={{ paddingLeft }}
				onClick={() => {
					onNavClick();
					item.onClick();
				}}
				className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition-all duration-200 select-none active:scale-[0.99] ${
					isDanger
						? "text-slate-500 hover:bg-rose-50 hover:text-rose-600"
						: "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
				}`}
			>
				<div className="flex items-center gap-2.5">
					<item.icon
						className={`h-4 w-4 transition-colors duration-200 ${
							isDanger
								? "text-slate-400 group-hover:text-rose-500"
								: "text-slate-400 group-hover:text-slate-600"
						}`}
						strokeWidth={1.75}
					/>
					<span className="truncate text-[13px] tracking-wide">
						{item.title}
					</span>
				</div>
			</button>
		);
	}

	// Case 2: Parent Collapsible Item
	if (isParentItem(item)) {
		return (
			<div className="flex w-full flex-col">
				<button
					type="button"
					style={{ paddingLeft }}
					onClick={() => setIsOpen((prev) => !prev)}
					aria-expanded={isOpen}
					aria-controls={submenuId}
					className="group flex w-full items-center justify-between rounded-xl px-3 py-2 text-slate-600 transition-all duration-200 select-none hover:bg-slate-100/60 hover:text-slate-900 active:scale-[0.99]"
				>
					<div className="flex items-center gap-2.5">
						<item.icon
							className="h-4 w-4 text-slate-400 transition-colors duration-200 group-hover:text-slate-600"
							strokeWidth={1.75}
						/>
						<span className="truncate text-[13px] tracking-wide">
							{item.title}
						</span>
					</div>
					<ChevronRightIcon
						className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
						strokeWidth={2}
					/>
				</button>

				<div
					id={submenuId}
					className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
						isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
					}`}
				>
					<div className="relative mt-0.5 flex flex-col gap-0.5 overflow-hidden min-h-0">
						<div
							className="absolute top-0 bottom-0 border-l border-slate-200"
							style={{ left: `${level * 12 + 19.5}px` }}
						/>
						{item.children.map((child) => (
							<NavItem
								key={child.to}
								item={child}
								onNavClick={onNavClick}
								level={level + 1}
							/>
						))}
					</div>
				</div>
			</div>
		);
	}

	// Case 3: NavLink Item
	return (
		<NavLink
			to={item.to}
			end={item.end}
			onClick={onNavClick}
			style={{ paddingLeft }}
			className={({ isActive }) =>
				`group flex w-full items-center justify-between rounded-xl px-3 py-2 transition-all duration-200 select-none active:scale-[0.99] ${
					isActive
						? "bg-slate-100 font-bold text-slate-900 shadow-xs"
						: "text-slate-600 hover:bg-slate-100/60 hover:text-slate-900"
				}`
			}
		>
			{({ isActive }) => (
				<>
					<div className="flex items-center gap-2.5">
						<item.icon
							className={`h-4 w-4 transition-colors duration-200 ${
								isActive
									? "text-emerald-800"
									: "text-slate-400 group-hover:text-slate-600"
							}`}
							strokeWidth={1.75}
						/>
						<span className="truncate text-[13px] tracking-wide">
							{item.title}
						</span>
					</div>

					<div className="flex items-center gap-2">
						{item.shortcut && (
							<kbd className="hidden group-hover:inline-flex h-5 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-400 shadow-xs">
								{item.shortcut}
							</kbd>
						)}
						{item.badge && (
							<span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 px-1.5 text-[10px] font-bold text-emerald-800">
								{item.badge}
							</span>
						)}
					</div>
				</>
			)}
		</NavLink>
	);
}

interface SidebarNavProps {
	className?: string;
	onLogout: () => void;
	onNavClick?: () => void;
	activeWorkspace?: string;
	groups?: NavGroupData[];
	bottomItems?: NavItemData[];
}

export function SidebarNav({
	className = "",
	onLogout,
	onNavClick = () => {},
	activeWorkspace,
	groups,
	bottomItems,
}: SidebarNavProps) {
	const navGroups = groups ?? NAV_GROUPS;
	const footerItems = bottomItems ?? getBottomItems(onLogout);

	return (
		<aside
			className={cn(
				"flex h-full w-65 flex-col border-r border-slate-200/85 bg-white p-4 font-sans text-slate-800",
				className,
			)}
		>
			<WorkspaceSwitcher selected={activeWorkspace} />

			<nav className="mt-2 flex flex-1 flex-col gap-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
				{navGroups.map((group, idx) => (
					<div key={group.heading ?? idx} className="flex flex-col gap-0.5">
						{group.heading && (
							<span className="mb-1.5 px-3 text-[10px] font-black tracking-wider text-slate-400 uppercase">
								{group.heading}
							</span>
						)}
						{group.items.map((item) => (
							<NavItem
								key={"to" in item ? item.to : item.title}
								item={item}
								onNavClick={onNavClick}
							/>
						))}
					</div>
				))}
			</nav>

			<div className="mt-auto flex flex-col gap-0.5 border-t border-slate-100 pt-4">
				{footerItems.map((item) => (
					<NavItem
						key={"to" in item ? item.to : item.title}
						item={item}
						onNavClick={onNavClick}
					/>
				))}
			</div>
		</aside>
	);
}
