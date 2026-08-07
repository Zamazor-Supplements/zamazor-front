import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";

interface LoadingScreenProps {
	message?: string;
	subtext?: string;
	className?: string;
}

export const LoadingScreen = ({
	message = "Loading your account...",
	subtext = "Preparing your custom nutrition workspace",
	className,
}: LoadingScreenProps) => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.25 }}
			className={cn(
				"fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-md p-4 selection:bg-emerald-100",
				className,
			)}
			role="status"
			aria-live="polite"
			aria-label={message}
		>
			{/* Top indeterminate progress bar for perceived performance */}
			<div className="absolute top-0 left-0 right-0 h-1 overflow-hidden bg-emerald-900/5">
				<motion.div
					className="h-full bg-emerald-800"
					initial={{ x: "-100%" }}
					animate={{ x: "100%" }}
					transition={{
						repeat: Infinity,
						duration: 1.4,
						ease: "easeInOut",
					}}
				/>
			</div>

			<div className="relative flex flex-col items-center justify-center text-center">
				{/* Glow / Pulse Backing Effect */}
				<div className="relative flex items-center justify-center">
					<motion.div
						className="absolute size-20 rounded-full bg-emerald-500/10 blur-xl"
						animate={{
							scale: [1, 1.25, 1],
							opacity: [0.4, 0.8, 0.4],
						}}
						transition={{
							repeat: Infinity,
							duration: 2,
							ease: "easeInOut",
						}}
					/>

					{/* Icon / Brand Wrapper */}
					<div className="relative flex size-14 items-center justify-center rounded-2xl border border-emerald-900/10 bg-white shadow-lg shadow-emerald-950/5">
						<Loader2Icon className="size-6 animate-spin text-emerald-900" />
					</div>
				</div>

				{/* Messaging Text Stack */}
				<div className="mt-6 space-y-1">
					<h3 className="font-playfair text-lg font-semibold tracking-tight text-slate-900">
						{message}
					</h3>
					{subtext && (
						<p className="text-xs text-slate-500 font-medium max-w-xs leading-relaxed">
							{subtext}
						</p>
					)}
				</div>
			</div>
		</motion.div>
	);
};
