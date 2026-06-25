"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import IdeasShell from "../_components/ideas-shell";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TIMEZONES = [
	{ label: "Local", value: Intl.DateTimeFormat().resolvedOptions().timeZone },
	{ label: "New York", value: "America/New_York" },
	{ label: "London", value: "Europe/London" },
	{ label: "Dubai", value: "Asia/Dubai" },
	{ label: "Tokyo", value: "Asia/Tokyo" },
	{ label: "Sydney", value: "Australia/Sydney" },
];

function formatTime(date: Date, timezone: string) {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	}).format(date);
}

function formatDate(date: Date, timezone: string) {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(date);
}

function getUtcOffset(date: Date, timezone: string) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		timeZoneName: "shortOffset",
	}).formatToParts(date);
	return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
}

export default function DateTimeApp() {
	const [now, setNow] = useState(() => new Date(0));
	const [timezone, setTimezone] = useState(TIMEZONES[0].value);

	useEffect(() => {
		setNow(new Date());
		const interval = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(interval);
	}, []);

	const time = formatTime(now, timezone);
	const date = formatDate(now, timezone);
	const offset = getUtcOffset(now, timezone);
	const [hours, minutes, seconds] = time.replace(/ AM| PM/, "").split(":").map(Number);
	const isPM = time.includes("PM");
	const hour24 = isPM && hours !== 12 ? hours + 12 : !isPM && hours === 12 ? 0 : hours;
	const secondAngle = (seconds / 60) * 360;
	const minuteAngle = ((minutes + seconds / 60) / 60) * 360;
	const hourAngle = (((hour24 % 12) + minutes / 60) / 12) * 360;

	return (
		<IdeasShell slug="date-time">
			<Card className="border-0 bg-white/15 shadow-2xl shadow-black/10 backdrop-blur-xl">
				<CardContent className="space-y-8 p-6 sm:p-8">
					<div className="flex items-center gap-2">
						<Globe className="h-5 w-5 text-white/80" />
						<Select value={timezone} onValueChange={(val) => { if (val) setTimezone(val); }}>
							<SelectTrigger className="flex-1 border-white/20 bg-white/10 text-white focus:ring-3 focus:ring-white/30">
								<SelectValue placeholder="Select timezone">
									({timezone})
								</SelectValue>
							</SelectTrigger>
							<SelectContent className="border-slate-200 bg-white text-slate-900">
								{TIMEZONES.map((tz) => (
									<SelectItem key={tz.value} value={tz.value}>
										{tz.label} ({tz.value})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
						<div className="relative h-48 w-48 shrink-0">
							<div className="absolute inset-0 rounded-full border-4 border-white/30 bg-white/5 shadow-inner" />
							{Array.from({ length: 12 }).map((_, i) => (
								<div
									key={i}
									className="absolute left-1/2 top-2 h-3 w-0.5 -translate-x-1/2 origin-[50%_88px] bg-white/60"
									style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
								/>
							))}
							<div
								className="absolute left-1/2 top-1/2 h-16 w-1 -translate-x-1/2 origin-bottom rounded-full bg-white shadow-md transition-transform duration-1000 ease-linear"
								style={{ transform: `translateX(-50%) translateY(-100%) rotate(${hourAngle}deg)` }}
							/>
							<div
								className="absolute left-1/2 top-1/2 h-20 w-0.5 -translate-x-1/2 origin-bottom rounded-full bg-white/90 shadow-md transition-transform duration-1000 ease-linear"
								style={{ transform: `translateX(-50%) translateY(-100%) rotate(${minuteAngle}deg)` }}
							/>
							<div
								className="absolute left-1/2 top-1/2 w-px -translate-x-1/2 origin-bottom rounded-full bg-amber-300 transition-transform duration-1000 ease-linear"
								style={{
									height: "5.5rem",
									transform: `translateX(-50%) translateY(-100%) rotate(${secondAngle}deg)`,
								}}
							/>
							<div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md" />
						</div>

						<div className="text-center sm:text-left">
							<div className="flex items-center justify-center gap-2 sm:justify-start">
								<Clock className="h-6 w-6 text-white/80" />
								<p className="font-mono text-5xl font-bold tracking-tight text-white tabular-nums sm:text-6xl">
									{time}
								</p>
							</div>
							<div className="mt-3 flex items-center justify-center gap-2 sm:justify-start">
								<Calendar className="h-5 w-5 text-white/70" />
								<p className="text-lg text-white/90">{date}</p>
							</div>
							<p className="mt-2 text-sm text-white/60">{offset}</p>
						</div>
					</div>

					<div className="grid grid-cols-3 gap-3">
						{[
							["Hours", String(hour24).padStart(2, "0")],
							["Minutes", String(minutes).padStart(2, "0")],
							["Seconds", String(seconds).padStart(2, "0")],
						].map(([label, value]) => (
							<div
								key={label}
								className="rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm transition-transform hover:scale-[1.03]"
							>
								<p className="text-xs uppercase tracking-wider text-white/60">{label}</p>
								<p className="mt-1 font-mono text-3xl font-bold text-white">{value}</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</IdeasShell>
	);
}
