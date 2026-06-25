"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	IDEAS,
	getIdeaBySlug,
	getIdeaIndex,
	getNextIdea,
	type IdeaSlug,
} from "./ideas-config";

type IdeasShellProps = {
	slug: IdeaSlug;
	children: React.ReactNode;
};

export default function IdeasShell({ slug, children }: IdeasShellProps) {
	const current = getIdeaBySlug(slug)!;
	const next = getNextIdea(slug);
	const currentIndex = getIdeaIndex(slug);

	return (
		<div
			className={cn(
				"relative min-h-[calc(100vh-4rem)] overflow-hidden bg-linear-to-br transition-colors duration-700",
				current.gradient,
			)}
		>
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -left-20 -top-20 h-72 w-72 animate-pulse rounded-full bg-white/10 blur-3xl" />
				<div className="absolute -bottom-24 -right-16 h-96 w-96 animate-pulse rounded-full bg-white/10 blur-3xl [animation-delay:1s]" />
				<div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 animate-pulse rounded-full bg-white/5 blur-2xl [animation-delay:0.5s]" />
			</div>

			<div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl flex-col px-4 py-8 sm:px-6">
				<header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
					<div className="mb-4 flex items-center gap-2">
						<Sparkles className={cn("h-5 w-5", current.accent)} />
						<span className={cn("text-sm font-medium tracking-wide", current.accent)}>
							Mini Project {currentIndex + 1} of {IDEAS.length}
						</span>
					</div>
					<h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
						{current.title}
					</h1>
					<p className={cn("mt-2 text-base sm:text-lg", current.accent)}>
						{current.description}
					</p>

					<div className="mt-5 flex items-center gap-2">
						{IDEAS.map((idea, index) => (
							<Link
								key={idea.slug}
								href={`/ideas/${idea.slug}`}
								className={cn(
									"h-2 rounded-full transition-all duration-300",
									index === currentIndex
										? "w-8 bg-white"
										: "w-2 bg-white/40 hover:bg-white/70",
								)}
								aria-label={`Go to ${idea.title}`}
							/>
						))}
					</div>
				</header>

				<main className="flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
					{children}
				</main>

				<footer className="mt-8 flex justify-center pb-4 animate-in fade-in slide-in-from-bottom-6 duration-700 [animation-delay:200ms] fill-mode-both">
					<Link href={`/ideas/${next.slug}`}>
						<Button
							size="lg"
							className="group h-12 gap-2 border-0 bg-white/20 px-8 text-base font-semibold text-white shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-xl"
						>
							Next: {next.title}
							<ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
						</Button>
					</Link>
				</footer>
			</div>
		</div>
	);
}
