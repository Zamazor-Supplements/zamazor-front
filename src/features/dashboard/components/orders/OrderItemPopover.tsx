import type { OrderItem } from "@/features/orders/schemas/orderSchema";
import { formatCurrency } from "@/shared/utils/price";
import { PackageIcon } from "lucide-react";
import { HoverCard } from "radix-ui";

export const OrderItemsPopover = ({ items }: { items: OrderItem[] }) => {
	return (
		<HoverCard.Root openDelay={150} closeDelay={100}>
			<HoverCard.Trigger asChild>
				<button className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-900">
					<PackageIcon className="size-3.5 text-slate-400" />
					{items.length} {items.length === 1 ? "Item" : "Items"}
				</button>
			</HoverCard.Trigger>

			<HoverCard.Portal>
				<HoverCard.Content
					side="top"
					align="start"
					sideOffset={6}
					className="z-50 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl animate-in fade-in zoom-in-95"
				>
					<div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
						<span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
							Order Contents
						</span>
						<span className="text-xs font-semibold text-slate-600">
							{items.reduce((acc, item) => acc + item.quantity, 0)} Units Total
						</span>
					</div>

					<div className="max-h-60 space-y-2.5 overflow-y-auto pr-1">
						{items.map((item) => (
							<div key={item.id} className="flex items-center gap-3">
								<div className="size-8 shrink-0 rounded-lg border border-slate-200/80 bg-slate-50 p-1">
									<img
										src={item.product?.imageUrl ?? undefined}
										alt=""
										className="size-full object-cover rounded"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-xs font-semibold text-slate-800">
										{item.product?.name}
									</p>
									<p className="text-[10px] text-slate-400">
										{item.quantity} × {formatCurrency(item.product.price)}
									</p>
								</div>
								<span className="text-xs font-bold text-slate-900">
									{formatCurrency(item.quantity * item.product.price)}
								</span>
							</div>
						))}
					</div>
				</HoverCard.Content>
			</HoverCard.Portal>
		</HoverCard.Root>
	);
};
