"use client";

import { useState } from "react";
import {
	Bell,
	Moon,
	Palette,
	Settings,
	Sun,
	User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import IdeasShell from "../_components/ideas-shell";

export default function ThemeSwapperApp() {
	const [isDark, setIsDark] = useState(false);

	return (
		<IdeasShell slug="dark-light-theme">
			<div
				className={cn(
					"overflow-hidden rounded-2xl shadow-2xl transition-all duration-700",
					isDark
						? "bg-slate-900 ring-1 ring-white/10"
						: "bg-white ring-1 ring-slate-200",
				)}
			>
				<div
					className={cn(
						"flex items-center justify-between border-b px-6 py-4 transition-colors duration-700",
						isDark ? "border-white/10 bg-slate-800/50" : "border-slate-100 bg-slate-50",
					)}
				>
					<div className="flex items-center gap-3">
						<div
							className={cn(
								"flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-500",
								isDark ? "bg-indigo-500 text-white" : "bg-primary text-white",
							)}
						>
							<Palette className="h-5 w-5" />
						</div>
						<div>
							<p
								className={cn(
									"font-semibold transition-colors duration-700",
									isDark ? "text-white" : "text-slate-900",
								)}
							>
								Theme Preview
							</p>
							<p
								className={cn(
									"text-sm transition-colors duration-700",
									isDark ? "text-slate-400" : "text-slate-500",
								)}
							>
								{isDark ? "Dark mode active" : "Light mode active"}
							</p>
						</div>
					</div>

					<Button
						onClick={() => setIsDark((prev) => !prev)}
						className={cn(
							"relative h-12 w-24 overflow-hidden rounded-full border-0 p-0 transition-all duration-700",
							isDark ? "bg-indigo-600 hover:bg-indigo-500" : "bg-amber-400 hover:bg-amber-300",
						)}
						aria-label="Toggle theme"
					>
						<span
							className={cn(
								"absolute flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all duration-500",
								isDark ? "left-[calc(100%-2.75rem)]" : "left-1",
							)}
						>
							{isDark ? (
								<Moon className="h-5 w-5 text-indigo-600" />
							) : (
								<Sun className="h-5 w-5 text-amber-500" />
							)}
						</span>
					</Button>
				</div>

				<CardContent
					className={cn(
						"space-y-5 p-6 transition-colors duration-700 sm:p-8",
						isDark ? "bg-slate-900" : "bg-white",
					)}
				>
					<div className="grid gap-4 sm:grid-cols-2">
						<div
							className={cn(
								"rounded-xl p-4 transition-all duration-700",
								isDark ? "bg-slate-800" : "bg-slate-50",
							)}
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-700",
										isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-primary/10 text-primary",
									)}
								>
									<User className="h-5 w-5" />
								</div>
								<div>
									<p
										className={cn(
											"font-medium transition-colors duration-700",
											isDark ? "text-white" : "text-slate-900",
										)}
									>
										Profile Card
									</p>
									<p
										className={cn(
											"text-sm transition-colors duration-700",
											isDark ? "text-slate-400" : "text-slate-500",
										)}
									>
										Sample user interface
									</p>
								</div>
							</div>
						</div>

						<div
							className={cn(
								"rounded-xl p-4 transition-all duration-700",
								isDark ? "bg-slate-800" : "bg-slate-50",
							)}
						>
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-700",
										isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-100 text-emerald-600",
									)}
								>
									<Bell className="h-5 w-5" />
								</div>
								<div>
									<p
										className={cn(
											"font-medium transition-colors duration-700",
											isDark ? "text-white" : "text-slate-900",
										)}
									>
										Notifications
									</p>
									<p
										className={cn(
											"text-sm transition-colors duration-700",
											isDark ? "text-slate-400" : "text-slate-500",
										)}
									>
										3 unread messages
									</p>
								</div>
							</div>
						</div>
					</div>

					<div
						className={cn(
							"rounded-xl border p-4 transition-all duration-700",
							isDark ? "border-white/10 bg-slate-800/50" : "border-slate-200 bg-white",
						)}
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Settings
									className={cn(
										"h-4 w-4 transition-colors duration-700",
										isDark ? "text-slate-400" : "text-slate-500",
									)}
								/>
								<span
									className={cn(
										"text-sm font-medium transition-colors duration-700",
										isDark ? "text-slate-300" : "text-slate-700",
									)}
								>
									Appearance
								</span>
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => setIsDark(false)}
									className={cn(
										"rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300",
										!isDark
											? "bg-primary text-white shadow-sm"
											: isDark
												? "bg-slate-700 text-slate-400 hover:bg-slate-600"
												: "bg-slate-100 text-slate-600",
									)}
								>
									Light
								</button>
								<button
									type="button"
									onClick={() => setIsDark(true)}
									className={cn(
										"rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-300",
										isDark
											? "bg-indigo-500 text-white shadow-sm"
											: "bg-slate-100 text-slate-600 hover:bg-slate-200",
									)}
								>
									Dark
								</button>
							</div>
						</div>
					</div>

					<div className="flex gap-3">
						<Button
							className={cn(
								"flex-1 transition-all duration-700",
								isDark
									? "bg-indigo-500 text-white hover:bg-indigo-400"
									: "bg-primary text-white hover:bg-primary/90",
							)}
						>
							Primary Action
						</Button>
						<Button
							variant="outline"
							className={cn(
								"flex-1 transition-all duration-700",
								isDark
									? "border-white/20 bg-transparent text-white hover:bg-white/10"
									: "border-slate-200 text-slate-700 hover:bg-slate-50",
							)}
						>
							Secondary
						</Button>
					</div>
				</CardContent>
			</div>
		</IdeasShell>
	);
}
