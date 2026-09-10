import type { OrderItem } from "@/features/orders/schemas/orderSchema";
import { formatCurrency } from "@/shared/utils/price";
import { PackageIcon } from "lucide-react";
import * as HoverCard from "@radix-ui/react-hover-card";

export const OrderItemsPopover = ({ items }: { items: OrderItem[] }) => {
	return (
		<HoverCard.Root openDelay={150} closeDelay={100}>
			<HoverCard.Trigger asChild>
				<button className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm border border-brand-900/10 bg-surface-2 px-2.5 py-1 text-xs font-semibold text-ink transition-colors hover:border-brand-600 hover:bg-brand-50 hover:text-brand-900">
					<PackageIcon className="size-3.5 text-ink-faint" />
					{items.length} {items.length === 1 ? "Item" : "Items"}
				</button>
			</HoverCard.Trigger>

			<HoverCard.Portal>
				<HoverCard.Content
					side="top"
					align="start"
					sideOffset={6}
					className="z-50 w-80 rounded-lg border border-brand-900/10 bg-card p-4 shadow-xl animate-in fade-in zoom-in-95"
				>
					<div className="mb-3 flex items-center justify-between border-b border-brand-900/10 pb-2">
						<span className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">
							Order Contents
						</span>
						<span className="text-xs font-semibold text-ink-soft">
							{items.reduce((acc, item) => acc + item.quantity, 0)} Units Total
						</span>
					</div>

					<div className="max-h-60 space-y-2.5 overflow-y-auto pr-1">
						{items.map((item) => (
							<div key={item.id} className="flex items-center gap-3">
								<div className="size-8 shrink-0 rounded-lg border border-brand-900/10 bg-surface-2 p-1">
									<img
										src={item.product?.imageUrl ?? undefined}
										alt=""
										className="size-full object-cover rounded"
									/>
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-xs font-semibold text-ink">
										{item.product?.name}
									</p>
									<p className="text-[10px] text-ink-faint">
										{item.quantity} × {formatCurrency(item.product.price)}
									</p>
								</div>
								<span className="text-xs font-bold text-ink">
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
