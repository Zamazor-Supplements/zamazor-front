import { useEffect, useRef, useState } from "react";
import { useDebounce } from "../hooks/use-debounce";
import { useProducts } from "@/features/products/services/product/queries";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SearchIcon } from "lucide-react";
import { SearchSuggestionsList } from "./SearchSuggestionsList";

interface SearchBarProps {
	onSelectProduct: (id: string) => void;
	onSubmitSearch: (query: string) => void;
	isMobile?: boolean;
}

export const HeaderSearchBar = ({
	onSelectProduct,
	onSubmitSearch,
	isMobile = false,
}: SearchBarProps) => {
	const [search, setSearch] = useState<string>("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);

	const debouncedSearchVal = useDebounce(search.trim(), 500);

	const { data: suggestions, isPending: isLoadingSuggestions } = useProducts(
		{ q: debouncedSearchVal, size: 5 },
		{ enabled: !!debouncedSearchVal },
	);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent | TouchEvent) => {
			if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
				setShowSuggestions(false);
			}
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setShowSuggestions(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (search.trim()) {
			setShowSuggestions(false);
			onSubmitSearch(search.trim());
		}
	};

	const handleSelect = (productId: string) => {
		setShowSuggestions(false);
		setSearch("");
		onSelectProduct(productId);
	};

	return (
		<div
			ref={searchRef}
			className={cn(
				"relative w-full",
				isMobile ? "px-4 pb-3 lg:hidden" : "mx-auto hidden max-w-2xl lg:block",
			)}
		>
			<form
				onSubmit={handleSubmit}
				className="relative flex w-full items-center"
			>
				<Input
					type="search"
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						setShowSuggestions(true);
					}}
					onFocus={() => setShowSuggestions(true)}
					placeholder="Search formulas..."
					className={cn(
						"w-full rounded-full border bg-white shadow-xs focus-visible:border-emerald-600 focus-visible:ring-emerald-600/10 focus-visible:ring-offset-0",
						isMobile
							? "h-10 border-emerald-900/10 pl-4 pr-12 text-xs"
							: "h-11 border-emerald-900/15 pl-5 pr-14 text-sm placeholder:text-slate-400",
					)}
				/>
				<Button
					type="submit"
					size="icon"
					variant={isMobile ? "ghost" : "default"}
					aria-label="Search"
					className={cn(
						"absolute right-1 top-1 cursor-pointer rounded-full",
						isMobile
							? "h-8 w-8 text-slate-400 hover:text-emerald-900"
							: "h-9 w-9 bg-emerald-900 text-white shadow-xs hover:bg-emerald-950",
					)}
				>
					<SearchIcon className="size-4" />
				</Button>
			</form>

			{showSuggestions && !!search.trim() && (
				<div
					className={cn(
						"animate-in fade-in slide-in-from-top-2 absolute z-50 mt-2 overflow-y-auto rounded-2xl border border-emerald-900/10 bg-white/95 shadow-lg backdrop-blur-md duration-150",
						isMobile ? "left-4 right-4 max-h-75" : "left-0 right-0 max-h-95",
					)}
				>
					<SearchSuggestionsList
						suggestions={suggestions}
						isLoading={isLoadingSuggestions}
						searchQuery={search}
						onSelectProduct={handleSelect}
					/>
				</div>
			)}
		</div>
	);
};
