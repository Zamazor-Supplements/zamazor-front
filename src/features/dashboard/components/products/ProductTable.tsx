import { Button } from "@/shared/components/ui/button";
import { Tooltip } from "@/shared/components/ui/tooltip";
import {
	ExternalLink,
	Edit,
	Trash2,
	ChevronLeftIcon,
	ChevronRightIcon,
	PackageXIcon,
} from "lucide-react";
import type {
	Product,
	ProductPage,
} from "@/features/products/schemas/productSchema";
import { formatCurrency } from "@/shared/utils/price";
import { APP_ROUTES } from "@/app/routes/paths";

type ProductTableProps = {
	productPage: ProductPage;
	highlightedProductId: string | null;
	onEditProduct: (product: Product) => void;
	onDeleteProduct: (productId: string) => void;
	onPageChange: (page: number) => void;
};

export const ProductTable = ({
	productPage,
	highlightedProductId,
	isFetching,
	onEditProduct,
	onDeleteProduct,
	onPageChange,
}: ProductTableProps & { isFetching?: boolean }) => {
	const products = productPage.items;
	const tableTotalPages = productPage.totalPages;
	const tableTotalElements = productPage.totalElements;

	const currentPage = productPage.page;
	const start = currentPage * productPage.size + 1;
	const end = Math.min(
		(currentPage + 1) * productPage.size,
		productPage.totalElements,
	);

	const onViewProduct = (productId: string) =>
		window.open(APP_ROUTES.PRODUCT(productId), "_blank");

	return (
		<div className="relative flex flex-col overflow-hidden border border-brand-900/10 bg-card shadow-sm">
			{/* Subtle Top Loader Bar during background refetching/pagination */}
			{isFetching && (
				<div className="absolute top-0 left-0 right-0 z-20 h-1 overflow-hidden bg-brand-100">
					<div className="h-full w-full animate-pulse bg-brand-600" />
				</div>
			)}

			{/* Table Area */}
			<div
				className={`min-h-96 overflow-x-auto transition-opacity duration-200 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}
			>
				<table className="w-full border-collapse text-left text-sm">
					<thead>
						<tr className="border-b border-brand-900/10 bg-surface-2/80 text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
							<th className="px-6 py-3.5">Product</th>
							<th className="px-6 py-3.5">Category</th>
							<th className="px-6 py-3.5 text-right">Price</th>
							<th className="px-6 py-3.5">Stock Status</th>
							<th className="px-6 py-3.5 text-right">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-brand-900/10">
						{products.length === 0 ? (
							<tr>
								<td colSpan={5} className="px-6 py-16 text-center">
									<div className="mx-auto flex max-w-xs flex-col items-center gap-2">
										<div className="flex size-12 items-center justify-center rounded-full bg-surface-2 text-ink-faint">
											<PackageXIcon className="size-6" />
										</div>
										<p className="text-sm font-medium text-ink">
											No products found
										</p>
										<p className="text-xs text-ink-soft">
											No products matched your current filters or search query.
										</p>
									</div>
								</td>
							</tr>
						) : (
							products.map((product) => {
								const isOut = product.stockQuantity === 0;
								const isLow =
									product.stockQuantity > 0 && product.stockQuantity < 10;

								return (
									<tr
										key={product.id}
										className={`group transition-colors duration-150 hover:bg-surface-2/60 ${
											highlightedProductId === product.id
												? "bg-brand-50/70"
												: ""
										}`}
									>
										{/* Product Meta */}
										<td className="px-6 py-3.5 max-w-md">
											<div className="flex items-center gap-3.5">
												<div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-brand-900/10 bg-surface-2 p-1">
													<img
														src={product.imageUrl}
														alt={product.name}
														className="h-full w-full object-contain"
													/>
												</div>
												<div className="min-w-0 flex-1">
													<div className="flex items-center gap-2">
														<p className="truncate text-xs font-semibold text-ink">
															{product.name}
														</p>
														<Tooltip content={`ID: ${product.id}`}>
															<span className="shrink-0 cursor-help select-all rounded border border-brand-900/10 bg-surface-2 px-1.5 py-0.5 text-[9px] font-mono text-ink-soft">
																#{product.id.slice(0, 8)}
															</span>
														</Tooltip>
													</div>
													<p
														className="mt-0.5 truncate text-[11px] text-ink-soft"
														title={product.description ?? undefined}
													>
														{product.description || "No description provided."}
													</p>
												</div>
											</div>
										</td>

										{/* Category Tag */}
										<td className="px-6 py-3.5 whitespace-nowrap">
											<span className="inline-flex items-center rounded-md border border-brand-900/10 bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-ink">
												{product.category.label}
											</span>
										</td>

										{/* Price */}
										<td className="px-6 py-3.5 whitespace-nowrap text-right font-mono text-xs font-semibold text-ink">
											{formatCurrency(product.price)}
										</td>

										{/* Stock Quantity */}
										<td className="px-6 py-3.5 whitespace-nowrap">
											<span
												className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
													isOut
														? "bg-rose-50 text-rose-700 border border-rose-200/60"
														: isLow
															? "bg-amber-50 text-amber-700 border border-amber-200/60"
															: "bg-brand-50 text-brand-700 border border-brand-200/60"
												}`}
											>
												<span
													className={`size-1.5 rounded-full ${
														isOut
															? "bg-rose-500"
															: isLow
																? "bg-amber-500"
																: "bg-brand-500"
													}`}
												/>
												{isOut
													? "Out of stock"
													: `${product.stockQuantity} in stock`}
											</span>
										</td>

										{/* Actions */}
										<td className="px-6 py-3.5 text-right whitespace-nowrap">
											<div className="flex items-center justify-end gap-1">
												<Tooltip content="View Store Page">
													<button
														onClick={() => onViewProduct(product.id)}
														className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink active:scale-95"
													>
														<ExternalLink className="size-4" />
													</button>
												</Tooltip>
												<Tooltip content="Edit Details">
													<button
														onClick={() => onEditProduct(product)}
														className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink active:scale-95"
													>
														<Edit className="size-4" />
													</button>
												</Tooltip>
												<Tooltip content="Delete Product">
													<button
														onClick={() => onDeleteProduct(product.id)}
														className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-rose-50 hover:text-rose-600 active:scale-95"
													>
														<Trash2 className="size-4" />
													</button>
												</Tooltip>
											</div>
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination Controls */}
			{tableTotalElements > 0 && (
				<div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-brand-900/10 bg-surface-2/50 px-6 py-3 select-none">
					<p className="text-xs text-ink-soft font-medium">
						Showing{" "}
						<span className="font-semibold text-ink">{start}</span>–
						<span className="font-semibold text-ink">{end}</span> of{" "}
						<span className="font-semibold text-ink">
							{tableTotalElements}
						</span>{" "}
						items
					</p>

					{tableTotalPages > 1 && (
						<div className="flex items-center gap-1.5">
							<Button
								variant="outline"
								size="icon"
								disabled={currentPage === 0 || isFetching}
								onClick={() => onPageChange(Math.max(0, currentPage - 1))}
								className="h-8 w-8 rounded-lg border-brand-900/10 text-ink-soft hover:bg-surface-2 disabled:opacity-40"
							>
								<ChevronLeftIcon className="size-4" />
							</Button>

							<div className="flex items-center gap-1 px-2 text-xs font-semibold text-ink">
								Page {currentPage + 1} of {tableTotalPages}
							</div>

							<Button
								variant="outline"
								size="icon"
								disabled={currentPage >= tableTotalPages - 1 || isFetching}
								onClick={() =>
									onPageChange(Math.min(tableTotalPages - 1, currentPage + 1))
								}
								className="h-8 w-8 rounded-lg border-brand-900/10 text-ink-soft hover:bg-surface-2 disabled:opacity-40"
							>
								<ChevronRightIcon className="size-4" />
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};
