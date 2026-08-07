import CONFIG from "@/app/config/constants";
import { APP_ROUTES } from "@/app/routes/paths";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useDocumentTitle } from "@/shared/hooks/use-document-title";
import {
	ArrowRightIcon,
	CheckCircle2Icon,
	CheckIcon,
	Clock3Icon,
	CopyIcon,
	HelpCircleIcon,
	Loader2Icon,
	MailIcon,
	MapPinIcon,
	MessageSquareIcon,
	PhoneIcon,
	SendIcon,
	ShieldCheckIcon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useForm, ValidationError } from "@formspree/react";

const FORMSPREE_FORM_ID = CONFIG.FORMSPREE_FORM_ID;

export const ContactPage = () => {
	const [copiedEmail, setCopiedEmail] = useState(false);
	const [formState, handleFormspreeSubmit] = useForm(FORMSPREE_FORM_ID);

	useDocumentTitle(`Contact Us | ${CONFIG.APP_NAME}`);

	const handleCopyEmail = () => {
		void navigator.clipboard.writeText(CONFIG.SUPPORT_EMAIL);
		setCopiedEmail(true);
		setTimeout(() => setCopiedEmail(false), 2000);
	};

	return (
		<div className="min-h-screen bg-[#fcfdfa] py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-100">
			<div className="mx-auto max-w-7xl space-y-10">
				{/* --- Hero Header --- */}
				<div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-900/10 bg-linear-to-br from-emerald-950 via-emerald-900 to-slate-950 p-8 sm:p-12 text-white shadow-xl shadow-emerald-950/10">
					<div className="relative z-10 max-w-3xl">
						<p className="text-[11px] font-black uppercase tracking-[0.26em] text-lime-300">
							Help & Support
						</p>
						<h1 className="mt-3 text-3xl sm:text-5xl font-playfair font-normal leading-tight">
							Get in touch with us.
						</h1>
						<p className="mt-4 text-sm sm:text-base leading-relaxed text-emerald-100/80">
							Have a question about your order, our nutrition formulas, or bulk
							purchasing? Our team is here to help you move fast.
						</p>
					</div>
					{/* Subtle Ambient Glow */}
					<div className="absolute -bottom-20 -right-20 size-80 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
				</div>

				{/* --- Contact Channels Highlights --- */}
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<MailIcon className="size-5" />
						</div>
						<h2 className="mt-4 text-lg font-bold text-slate-950">
							Email support
						</h2>
						<p className="mt-1 text-sm leading-relaxed text-slate-500">
							Response guaranteed within 24 business hours.
						</p>
						<p className="mt-3 text-sm font-semibold text-emerald-900">
							{CONFIG.SUPPORT_EMAIL}
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<PhoneIcon className="size-5" />
						</div>
						<h2 className="mt-4 text-lg font-bold text-slate-950">
							Phone line
						</h2>
						<p className="mt-1 text-sm leading-relaxed text-slate-500">
							Monday to Friday, 9:00 AM - 5:00 PM.
						</p>
						<p className="mt-3 text-sm font-semibold text-emerald-900">
							{CONFIG.SUPPORT_PHONE}
						</p>
					</div>

					<div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-xs sm:col-span-2 xl:col-span-1">
						<div className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
							<ShieldCheckIcon className="size-5" />
						</div>
						<h2 className="mt-4 text-lg font-bold text-slate-950">
							Order tracking
						</h2>
						<p className="mt-1 text-sm leading-relaxed text-slate-500">
							Check your active shipment status in real-time.
						</p>
						<Link
							to={APP_ROUTES.PAGES.FAQ}
							className="mt-3 inline-flex items-center text-xs font-bold text-emerald-800 hover:underline"
						>
							Visit help FAQ
							<ArrowRightIcon className="ml-1 size-3" />
						</Link>
					</div>
				</div>

				{/* --- Main Section: Formspree Form + Sidebar Info --- */}
				<div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
					{/* Formspree Interactive Form Card */}
					<div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 sm:p-10 shadow-xs">
						<div className="flex items-center gap-3 mb-6">
							<div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800">
								<MessageSquareIcon className="size-5" />
							</div>
							<div>
								<h2 className="text-2xl font-playfair font-normal text-slate-950">
									Send us a message
								</h2>
								<p className="text-xs text-slate-500">
									Fill out the fields below to reach our desk.
								</p>
							</div>
						</div>

						{formState.succeeded ? (
							<div className="flex min-h-95 flex-col items-center justify-center rounded-3xl border border-emerald-900/10 bg-emerald-50/40 p-8 text-center animate-in fade-in duration-300">
								<div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-900 text-white shadow-md shadow-emerald-950/10">
									<CheckCircle2Icon className="size-8" />
								</div>
								<h3 className="mt-5 font-playfair text-2xl font-normal text-slate-950">
									Message Sent Successfully!
								</h3>
								<p className="mt-2 max-w-sm text-sm text-slate-600 leading-relaxed">
									Thank you for reaching out. We have received your message and
									will reply within 24 hours.
								</p>
							</div>
						) : (
							<form onSubmit={handleFormspreeSubmit} className="space-y-4">
								{/* Formspree Honeypot (Spam Guard) */}
								<input
									type="text"
									name="_gotcha"
									className="hidden"
									tabIndex={-1}
								/>

								<div className="grid gap-4 sm:grid-cols-2">
									<div>
										<label
											htmlFor="name"
											className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
										>
											Full Name *
										</label>
										<Input
											id="name"
											name="name"
											required
											placeholder="e.g. John Doe"
											className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white"
										/>
										<ValidationError
											prefix="Name"
											field="name"
											errors={formState.errors}
										/>
									</div>

									<div>
										<label
											htmlFor="email"
											className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
										>
											Email Address *
										</label>
										<Input
											id="email"
											type="email"
											name="email"
											required
											placeholder="you@example.com"
											className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white"
										/>
										<ValidationError
											prefix="Email"
											field="email"
											errors={formState.errors}
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor="subject"
										className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
									>
										Subject / Order #
									</label>
									<Input
										id="subject"
										name="subject"
										placeholder="e.g. Question about order #1042"
										className="rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white"
									/>
									<ValidationError
										prefix="Subject"
										field="subject"
										errors={formState.errors}
									/>
								</div>

								<div>
									<label
										htmlFor="message"
										className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
									>
										Your Message *
									</label>
									<textarea
										id="message"
										name="message"
										required
										rows={5}
										placeholder="Tell us how we can help..."
										className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-2 focus:ring-emerald-700/20"
									/>
									<ValidationError
										prefix="Message"
										field="message"
										errors={formState.errors}
									/>
								</div>

								{formState.errors && (
									<p className="text-xs font-semibold text-rose-600">
										Please check the form inputs above.
									</p>
								)}

								<Button
									type="submit"
									disabled={formState.submitting}
									className="h-12 w-full sm:w-auto rounded-xl bg-emerald-950 px-8 font-semibold text-white hover:bg-emerald-900 disabled:opacity-50 cursor-pointer"
								>
									{formState.submitting ? (
										<>
											<Loader2Icon className="mr-2 size-4 animate-spin" />
											Sending...
										</>
									) : (
										<>
											<SendIcon className="mr-2 size-4" />
											Send message
										</>
									)}
								</Button>
							</form>
						)}
					</div>

					{/* Right Sidebar Details */}
					<div className="space-y-6">
						{/* Direct Details Card */}
						<div className="rounded-[2.5rem] border border-emerald-900/10 bg-white p-6 sm:p-8 shadow-xs">
							<h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
								Direct Info
							</h3>

							<div className="mt-6 space-y-4">
								{/* Email Item */}
								<div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
									<div className="flex items-center gap-3">
										<MailIcon className="size-4 text-emerald-800" />
										<div>
											<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
												Email
											</p>
											<p className="text-sm font-semibold text-slate-900">
												{CONFIG.SUPPORT_EMAIL}
											</p>
										</div>
									</div>
									<button
										onClick={handleCopyEmail}
										className="p-2 text-slate-400 hover:text-emerald-800 transition-colors cursor-pointer"
										title="Copy email"
									>
										{copiedEmail ? (
											<CheckIcon className="size-4 text-emerald-700" />
										) : (
											<CopyIcon className="size-4" />
										)}
									</button>
								</div>

								{/* Phone Item */}
								<div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
									<PhoneIcon className="size-4 text-emerald-800" />
									<div>
										<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
											Phone
										</p>
										<p className="text-sm font-semibold text-slate-900">
											{CONFIG.SUPPORT_PHONE}
										</p>
									</div>
								</div>

								{/* Address Item */}
								<div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
									<MapPinIcon className="size-4 text-emerald-800" />
									<div>
										<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
											Address
										</p>
										<p className="text-sm font-semibold text-slate-900">
											12 Rue des Jasmins, Casablanca, Morocco
										</p>
									</div>
								</div>

								{/* Hours Item */}
								<div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
									<Clock3Icon className="size-4 text-emerald-800" />
									<div>
										<p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
											Hours
										</p>
										<p className="text-sm font-semibold text-slate-900">
											Mon - Fri: 9:00 - 17:00 (GMT+1)
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Quick Link Card to FAQ */}
						<div className="rounded-[2.5rem] border border-emerald-900/10 bg-[#f2f8ef] p-6 sm:p-8">
							<div className="flex items-start gap-3">
								<div className="grid size-10 place-items-center rounded-2xl bg-emerald-900 text-white shrink-0">
									<HelpCircleIcon className="size-5" />
								</div>
								<div>
									<h4 className="text-base font-semibold text-slate-950">
										Looking for quick answers?
									</h4>
									<p className="mt-1 text-xs text-slate-600 leading-relaxed">
										Check out our Frequently Asked Questions for fast details on
										shipping, returns, and payment options.
									</p>
									<Button
										asChild
										variant="link"
										className="mt-3 p-0 h-auto text-xs font-bold text-emerald-900 hover:text-emerald-950 cursor-pointer"
									>
										<Link to={APP_ROUTES.PAGES.FAQ}>
											Open Help Center
											<ArrowRightIcon className="ml-1.5 size-3.5" />
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
