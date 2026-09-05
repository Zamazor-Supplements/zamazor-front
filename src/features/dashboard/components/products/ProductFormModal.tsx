import { type Category } from "@/features/products/schemas/categorySchema";
import {
	type CreateProductOutput,
	type Product,
	type UpdateProductOutput,
} from "@/features/products/schemas/productSchema";
import { EditProductForm } from "./EditProductForm";
import { CreateProductForm } from "./CreateProductForm";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/shared/components/ui/dialog";

export type ProductFormModalProps = {
	isOpen: boolean;
	categories: Category[];
	onClose: () => void;
	onCreateCategory: (name: string) => Promise<Category>;
} & (
	| {
			mode: "create";
			onSubmit: (values: CreateProductOutput) => Promise<void> | void;
	  }
	| {
			mode: "edit";
			editingProduct: Product;
			onSubmit: (values: UpdateProductOutput) => Promise<void> | void;
	  }
);

export const ProductFormModal = (props: ProductFormModalProps) => {
	const { isOpen, onClose } = props;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border-brand-900/10 bg-card p-6 shadow-2xl sm:p-8">
				<DialogHeader className="border-b border-brand-900/10 pb-4">
					<DialogTitle className="text-xl font-bold text-ink">
						{props.mode === "edit" ? "Edit Product" : "New Supplement Product"}
					</DialogTitle>

					<DialogDescription className="text-xs text-ink-soft">
						{props.mode === "edit"
							? "Update inventory records and pricing details."
							: "Fill out the information below to register a new product."}
					</DialogDescription>
				</DialogHeader>

				{props.mode === "edit" ? (
					<EditProductForm {...props} />
				) : (
					<CreateProductForm {...props} />
				)}
			</DialogContent>
		</Dialog>
	);
};
