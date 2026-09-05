import { Tooltip } from "@/shared/components/ui/tooltip";
import { ExternalLink, Edit, Trash2, PackageXIcon } from "lucide-react";
import type {
	Product,
	ProductPage,
} from "@/features/products/schemas/productSchema";
import { formatCurrency } from "@/shared/utils/price";
import { APP_ROUTES } from "@/app/routes/paths";
import { TableEmptyRow } from "../shared/TableEmptyRow";
import { TableFetchBar } from "../shared/TableFetchBar";
import { TablePagination } from "../shared/TablePagination";

type ProductTableProps = {
	productPage: ProductPage;
	highlightedProductId: string | null;
	isFetching: boolean;
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
}: ProductTableProps) => {
	const products = productPage.items;

	const onViewProduct = (productId: string) =>
		window.open(APP_ROUTES.PRODUCT({ id: productId }), "_blank");

	return (
		<>
			<TableFetchBar isFetching={isFetching} />

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
							<TableEmptyRow
								colSpan={5}
								icon={PackageXIcon}
								title="No products found"
								description="No products matched your current filters or search query."
							/>
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
												{isOut ? "Out of stock" : `${product.stockQuantity} in stock`}
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

			<TablePagination
				page={productPage.page}
				size={productPage.size}
				totalPages={productPage.totalPages}
				totalElements={productPage.totalElements}
				itemLabel="products"
				disabled={isFetching}
				onPageChange={onPageChange}
			/>
		</>
	);
};
