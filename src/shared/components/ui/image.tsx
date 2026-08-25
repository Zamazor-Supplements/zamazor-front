import { useState } from "react";
import { LeafIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageProps {
	src: string;
	alt: string;
	className?: string;
	objectFit?: "cover" | "contain";
	aspectRatio?: string;
	loading?: "lazy" | "eager";
}

export const Image = ({
	src,
	alt,
	className,
	objectFit = "cover",
	aspectRatio,
	loading = "lazy",
}: ImageProps) => {
	const [failed, setFailed] = useState(false);
	const [currentSrc, setCurrentSrc] = useState(src);
	if (currentSrc !== src) {
		setCurrentSrc(src);
		setFailed(false);
	}

	const style = aspectRatio ? { aspectRatio } : undefined;

	if (failed || !src) {
		return (
			<div
				role="img"
				aria-label={alt}
				style={style}
				className={cn(
					"grid place-items-center bg-brand-50 text-brand-300",
					className,
				)}
			>
				<LeafIcon className="size-8" strokeWidth={1.5} />
			</div>
		);
	}

	return (
		<img
			src={src}
			alt={alt}
			loading={loading}
			onError={() => setFailed(true)}
			style={style}
			className={cn(
				objectFit === "contain" ? "object-contain" : "object-cover",
				className,
			)}
		/>
	);
};
