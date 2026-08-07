export const CheckoutSkeleton = () => {
	return (
		<div className="min-h-screen bg-[#fcfdfa] text-slate-900 flex flex-col justify-between animate-pulse">
			<div>
				{/* Top Banner Skeleton */}
				<div className="bg-emerald-950 px-4 py-3 h-9 w-full" />

				{/* Header Skeleton */}
				<header className="mx-auto mt-2 w-[calc(100%-2rem)] max-w-7xl rounded-2xl border border-emerald-900/10 bg-[#f7fbf3]/90 shadow-md p-4 flex items-center justify-between">
					<div className="h-5 w-16 bg-emerald-900/10 rounded-lg" />
					<div className="flex items-center gap-2">
						<div className="size-9 rounded-lg bg-emerald-900/10" />
						<div className="h-5 w-32 bg-emerald-900/10 rounded-lg" />
					</div>
					<div className="h-5 w-24 bg-emerald-900/10 rounded-lg" />
				</header>

				{/* Main Content Skeleton */}
				<main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
					<div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
						{/* Left Column: Form Steps Skeleton */}
						<div className="space-y-6">
							{/* Step 1 Skeleton */}
							<div className="bg-white rounded-3xl border border-emerald-900/5 p-5 sm:p-6 shadow-xs space-y-4">
								<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
									<div className="size-6 bg-emerald-900/20 rounded-full" />
									<div className="h-5 w-40 bg-slate-200 rounded-md" />
								</div>
								<div className="space-y-2">
									<div className="h-3 w-20 bg-slate-200 rounded" />
									<div className="h-11 w-full bg-slate-100 rounded-xl" />
								</div>
							</div>

							{/* Step 2 Skeleton */}
							<div className="bg-white rounded-3xl border border-emerald-900/5 p-5 sm:p-6 shadow-xs space-y-4">
								<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
									<div className="size-6 bg-emerald-900/20 rounded-full" />
									<div className="h-5 w-44 bg-slate-200 rounded-md" />
								</div>
								<div className="space-y-4">
									<div className="space-y-2">
										<div className="h-3 w-24 bg-slate-200 rounded" />
										<div className="h-11 w-full bg-slate-100 rounded-xl" />
									</div>
									<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
										<div className="space-y-2">
											<div className="h-3 w-16 bg-slate-200 rounded" />
											<div className="h-11 w-full bg-slate-100 rounded-xl" />
										</div>
										<div className="space-y-2">
											<div className="h-3 w-20 bg-slate-200 rounded" />
											<div className="h-11 w-full bg-slate-100 rounded-xl" />
										</div>
									</div>
									<div className="h-16 w-full bg-slate-100 rounded-2xl" />
								</div>
							</div>

							{/* Step 3 Skeleton */}
							<div className="bg-white rounded-3xl border border-emerald-900/5 p-5 sm:p-6 shadow-xs space-y-4">
								<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
									<div className="size-6 bg-emerald-900/20 rounded-full" />
									<div className="h-5 w-36 bg-slate-200 rounded-md" />
								</div>
								<div className="h-24 w-full bg-emerald-50/50 rounded-2xl border border-emerald-950/5" />
							</div>

							{/* Submit Button Skeleton */}
							<div className="h-14 w-full bg-emerald-900/20 rounded-2xl" />
						</div>

						{/* Right Column: Order Review Skeleton */}
						<div className="space-y-4">
							<div className="bg-white rounded-3xl border border-emerald-900/5 p-5 sm:p-6 shadow-md shadow-emerald-950/5 space-y-4">
								<div className="h-6 w-32 bg-slate-200 rounded-md border-b border-slate-100 pb-3" />

								{/* Items List Skeleton */}
								<div className="space-y-3 py-2">
									{[1, 2].map((i) => (
										<div
											key={i}
											className="flex gap-3 items-center justify-between"
										>
											<div className="flex gap-3 items-center">
												<div className="size-12 bg-slate-100 rounded-xl" />
												<div className="space-y-1.5">
													<div className="h-3.5 w-28 bg-slate-200 rounded" />
													<div className="h-3 w-14 bg-slate-100 rounded" />
												</div>
											</div>
											<div className="h-4 w-12 bg-slate-200 rounded" />
										</div>
									))}
								</div>

								{/* Pricing Skeleton */}
								<div className="space-y-3 border-t border-slate-100 pt-4">
									<div className="flex justify-between">
										<div className="h-3 w-16 bg-slate-100 rounded" />
										<div className="h-3 w-12 bg-slate-200 rounded" />
									</div>
									<div className="flex justify-between">
										<div className="h-3 w-16 bg-slate-100 rounded" />
										<div className="h-3 w-20 bg-slate-200 rounded" />
									</div>
									<div className="flex justify-between border-t border-slate-100 pt-3 mt-2">
										<div className="h-4 w-24 bg-slate-200 rounded" />
										<div className="h-4 w-16 bg-slate-300 rounded" />
									</div>
								</div>
							</div>

							{/* Trust USPs Skeleton */}
							<div className="bg-white rounded-3xl border border-emerald-900/5 p-5 shadow-xs space-y-4">
								<div className="flex items-start gap-3">
									<div className="size-5 bg-emerald-700/20 rounded-full shrink-0" />
									<div className="space-y-1.5 flex-1">
										<div className="h-3.5 w-32 bg-slate-200 rounded" />
										<div className="h-3 w-full bg-slate-100 rounded" />
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="size-5 bg-emerald-700/20 rounded-full shrink-0" />
									<div className="space-y-1.5 flex-1">
										<div className="h-3.5 w-28 bg-slate-200 rounded" />
										<div className="h-3 w-full bg-slate-100 rounded" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>

			{/* Footer Skeleton */}
			<footer className="text-center py-8 border-t border-emerald-900/5 mt-12 bg-white">
				<div className="h-3 w-72 bg-slate-200 rounded mx-auto" />
			</footer>
		</div>
	);
};
