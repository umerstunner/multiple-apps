"use client";

import { useMemo, useState } from "react";
import {
	Cake,
	CalendarDays,
	Gift,
	Heart,
	Sparkles,
	type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import IdeasShell from "../_components/ideas-shell";

function calculateAge(birthDate: Date) {
	const today = new Date();
	let years = today.getFullYear() - birthDate.getFullYear();
	let months = today.getMonth() - birthDate.getMonth();
	let days = today.getDate() - birthDate.getDate();

	if (days < 0) {
		months--;
		const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
		days += prevMonth.getDate();
	}
	if (months < 0) {
		years--;
		months += 12;
	}

	const totalDays = Math.floor(
		(today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24),
	);

	const nextBirthday = new Date(
		today.getFullYear(),
		birthDate.getMonth(),
		birthDate.getDate(),
	);
	if (nextBirthday <= today) {
		nextBirthday.setFullYear(today.getFullYear() + 1);
	}
	const daysUntilBirthday = Math.ceil(
		(nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
	);

	return { years, months, days, totalDays, daysUntilBirthday };
}

export default function AgeCalculatorApp() {
	const [birthDate, setBirthDate] = useState("");
	const [error, setError] = useState("");

	const result = useMemo(() => {
		if (!birthDate) return null;
		const parsed = new Date(birthDate + "T00:00:00");
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (isNaN(parsed.getTime())) {
			setError("Invalid date");
			return null;
		}
		if (parsed > today) {
			setError("Birth date cannot be in the future");
			return null;
		}

		setError("");
		return calculateAge(parsed);
	}, [birthDate]);

	const maxDate = new Date().toISOString().split("T")[0];

	return (
		<IdeasShell slug="age-calculator">
			<Card className="border-0 bg-white/15 shadow-2xl shadow-black/10 backdrop-blur-xl">
				<CardContent className="space-y-6 p-6 sm:p-8">
					<div className="space-y-2">
						<label className="flex items-center gap-2 text-sm font-medium text-white/80">
							<Cake className="h-4 w-4" />
							Your birth date
						</label>
						<Input
							type="date"
							max={maxDate}
							value={birthDate}
							onChange={(e) => setBirthDate(e.target.value)}
							className="h-12 border-white/20 bg-white/10 text-white scheme-dark focus-visible:ring-white/30"
						/>
					</div>

					{error && (
						<p className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-white">
							{error}
						</p>
					)}

					{!birthDate && (
						<div className="py-8 text-center">
							<Sparkles className="mx-auto h-16 w-16 animate-pulse text-white/60" />
							<p className="mt-4 text-lg text-white/80">
								Pick your birth date to see your exact age
							</p>
						</div>
					)}

					{result && (
						<div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
							<div className="text-center">
								<p className="text-sm uppercase tracking-widest text-white/70">
									You are
								</p>
								<p className="mt-2 text-5xl font-bold text-white sm:text-6xl">
									{result.years}
									<span className="text-2xl font-medium text-white/80"> years</span>
								</p>
								<p className="mt-1 text-xl text-white/90">
									{result.months} months, {result.days} days
								</p>
							</div>

							<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
								{(
									[
										{ icon: CalendarDays, label: "Years", value: result.years },
										{ icon: Heart, label: "Months", value: result.months },
										{ icon: Sparkles, label: "Days", value: result.days },
										{
											icon: Gift,
											label: "Total Days",
											value: result.totalDays.toLocaleString(),
										},
									] satisfies { icon: LucideIcon; label: string; value: string | number }[]
								).map(({ icon: Icon, label, value }) => (
									<div
										key={label}
										className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm transition-transform hover:scale-[1.03]"
									>
										<Icon className="mx-auto h-5 w-5 text-white/70" />
										<p className="mt-2 text-xs uppercase tracking-wider text-white/60">
											{label}
										</p>
										<p className="mt-1 text-2xl font-bold text-white">{value}</p>
									</div>
								))}
							</div>

							<div className="rounded-xl bg-linear-to-r from-white/20 to-white/10 p-5 text-center backdrop-blur-sm">
								<p className="text-sm text-white/70">Next birthday in</p>
								<p className="mt-1 text-3xl font-bold text-white">
									{result.daysUntilBirthday}{" "}
									<span className="text-lg font-medium text-white/80">
										{result.daysUntilBirthday === 1 ? "day" : "days"}
									</span>
								</p>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</IdeasShell>
	);
}
