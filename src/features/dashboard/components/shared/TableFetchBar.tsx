type TableFetchBarProps = {
	isFetching: boolean;
};

/** Thin top loader for background refetches; needs a positioned parent. */
export const TableFetchBar = ({ isFetching }: TableFetchBarProps) =>
	isFetching ? (
		<div className="absolute inset-x-0 top-0 z-20 h-1 overflow-hidden bg-brand-100">
			<div className="h-full w-full animate-pulse bg-brand-600" />
		</div>
	) : null;
