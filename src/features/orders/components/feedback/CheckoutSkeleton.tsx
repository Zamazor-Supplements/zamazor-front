export const CheckoutSkeleton = () => (
	<div className="min-h-screen bg-[#fcfdfa] flex flex-col justify-between overflow-x-hidden animate-pulse">
		<div>
			<div className="bg-brand-950/80 h-9 w-full mb-2" />
			<div className="mx-auto mt-2 w-[calc(100%-2rem)] max-w-7xl rounded-2xl bg-slate-200 h-16 mb-8" />

			<main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_420px] gap-8 items-start">
					{/* Form Skeleton */}
					<div className="space-y-6">
						<div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
							<div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
							<div className="h-11 bg-slate-100 rounded-lg" />
						</div>
						<div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
							<div className="h-6 bg-slate-200 rounded w-1/3 mb-4" />
							<div className="h-11 bg-slate-100 rounded-lg" />
							<div className="grid grid-cols-2 gap-4">
								<div className="h-11 bg-slate-100 rounded-lg" />
								<div className="h-11 bg-slate-100 rounded-lg" />
							</div>
						</div>
						<div className="bg-white rounded-3xl border border-slate-100 p-6">
							<div className="h-6 bg-slate-200 rounded w-1/4 mb-4" />
							<div className="h-20 bg-slate-100 rounded-2xl" />
						</div>
					</div>

					{/* Order Review Skeleton */}
					<div className="space-y-4">
						<div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4">
							<div className="h-6 bg-slate-200 rounded w-1/2 mb-4" />
							<div className="space-y-3">
								<div className="h-12 bg-slate-100 rounded-lg" />
								<div className="h-12 bg-slate-100 rounded-lg" />
							</div>
							<div className="pt-4 border-t border-slate-100 space-y-2">
								<div className="h-4 bg-slate-100 rounded w-full" />
								<div className="h-4 bg-slate-100 rounded w-full" />
								<div className="h-6 bg-slate-200 rounded w-full mt-4" />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>

		<footer className="h-16 bg-white border-t border-slate-100 mt-12" />
	</div>
);
