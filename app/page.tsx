import ImageTabs from "@/components/img-tabs";
import { Button } from "@/components/ui/button";
import {
	ArrowRight,
	BriefcaseBusiness,
	CheckCircle2,
	Columns3,
	Search,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col bg-white">
			<main className="flex-1">
				<section className="overflow-hidden bg-[linear-gradient(180deg,#fff7fa_0%,#ffffff_72%)] px-4 py-20 sm:py-28">
					<div className="container mx-auto grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
						<div className="max-w-3xl">
							<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-3 py-1 text-sm font-medium text-primary shadow-sm">
								<BriefcaseBusiness className="h-4 w-4" />
								Application pipeline for serious job hunts
							</div>
							<h1 className="text-5xl font-bold leading-tight text-slate-950 sm:text-6xl">
								Job Tracker
							</h1>
							<p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
								Capture opportunities, move them through a visual Kanban pipeline,
								and keep links, salary notes, tags, and follow-up details close at
								hand.
							</p>
							<div className="mt-8 flex flex-col gap-3 sm:flex-row">
								<Link href="/sign-up">
									<Button size="lg" className="h-12 px-7 text-base font-medium">
										Start for free <ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</Link>
								<Link href="/sign-in">
									<Button size="lg" variant="outline" className="h-12 px-7 text-base">
										Open dashboard
									</Button>
								</Link>
							</div>
							<div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm text-slate-600">
								<div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
									<p className="text-2xl font-bold text-slate-950">5</p>
									<p>pipeline stages</p>
								</div>
								<div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
									<p className="text-2xl font-bold text-slate-950">Drag</p>
									<p>to update status</p>
								</div>
								<div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
									<p className="text-2xl font-bold text-slate-950">Notes</p>
									<p>for every role</p>
								</div>
							</div>
						</div>

						<div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xl shadow-primary/10">
							<div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
								<div>
									<p className="text-sm font-semibold text-slate-950">Live pipeline</p>
									<p className="text-xs text-slate-500">Search, track, and follow up</p>
								</div>
								<Search className="h-5 w-5 text-primary" />
							</div>
							<div className="grid gap-3 sm:grid-cols-3">
								{["Applied", "Interview", "Offer"].map((stage, index) => (
									<div key={stage} className="rounded-lg bg-slate-50 p-3">
										<p className="mb-3 text-xs font-semibold uppercase text-slate-500">
											{stage}
										</p>
										{Array.from({ length: index + 1 }).map((_, cardIndex) => (
											<div
												key={cardIndex}
												className="mb-2 rounded-md border border-slate-200 bg-white p-3 shadow-sm"
											>
												<div className="h-2 w-20 rounded bg-slate-900" />
												<div className="mt-2 h-2 w-14 rounded bg-primary/30" />
												<div className="mt-3 flex gap-1">
													<span className="h-5 w-12 rounded-full bg-primary/10" />
													<span className="h-5 w-10 rounded-full bg-emerald-100" />
												</div>
											</div>
										))}
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				<ImageTabs />

				<section className="border-t bg-slate-50 py-20">
					<div className="container mx-auto px-4">
						<div className="mb-10 max-w-2xl">
							<h2 className="text-3xl font-bold text-slate-950">Built for follow-through</h2>
							<p className="mt-3 text-slate-600">
								A job search gets messy fast. This app keeps the important details
								visible and movable.
							</p>
						</div>
						<div className="grid gap-5 md:grid-cols-3">
							{[
								[Columns3, "Organize Applications", "Move roles through Applied, Interview, Offer, and decision stages."],
								[TrendingUp, "Track Progress", "Use metrics and filters to understand where your search stands."],
								[CheckCircle2, "Stay Prepared", "Keep posting links, salary ranges, notes, and tags attached to each role."],
							].map(([Icon, title, body]) => (
								<div key={title as string} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
									<Icon className="mb-4 h-7 w-7 text-primary" />
									<h3 className="text-xl font-semibold text-slate-950">{title as string}</h3>
									<p className="mt-3 text-sm leading-6 text-slate-600">{body as string}</p>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
