import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ZapIcon } from "lucide-react";

interface LoadingScreenProps {
	message?: string;
	subtext?: string;
	className?: string;
	fullScreen?: boolean;
}

export const LoadingScreen = ({
	message = "Loading...",
	subtext = "Preparing your nutrition workspace",
	className,
	fullScreen = true,
}: LoadingScreenProps) => {
	const content = (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2, ease: "easeOut" }}
			className="relative flex flex-col items-center justify-center text-center p-6"
		>
			<div className="relative flex items-center justify-center mb-5">
				{/* Expanding radar rings for a dynamic energy effect */}
				<motion.div
					className="absolute size-16 rounded-2xl border border-brand-500/30"
					animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
					transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
				/>
				<motion.div
					className="absolute size-16 rounded-2xl bg-brand-500/10"
					animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
					transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
				/>
				{/* Icon Container */}
				<div className="relative flex size-14 items-center justify-center rounded-2xl border border-brand-900/10 bg-white shadow-lg shadow-brand-950/5">
					<motion.div
						animate={{ scale: [1, 1.12, 1] }}
						transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
					>
						<ZapIcon className="size-6 text-brand-800" />
					</motion.div>
				</div>
			</div>

			<div className="space-y-1">
				<h3 className="font-playfair text-base font-semibold tracking-tight text-slate-900">
					{message}
				</h3>
				{subtext && (
					<p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
						{subtext}
					</p>
				)}
			</div>
		</motion.div>
	);

	if (!fullScreen) {
		return (
			<div
				className={cn(
					"flex min-h-[50vh] w-full flex-col items-center justify-center bg-transparent",
					className,
				)}
			>
				{content}
			</div>
		);
	}

	return (
		<div
			className={cn(
				"fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm p-4",
				className,
			)}
		>
			{content}
		</div>
	);
};
