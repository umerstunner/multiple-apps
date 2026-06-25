"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeftRight, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import IdeasShell from "../_components/ideas-shell";

const CURRENCIES = [
	{ code: "USD", name: "US Dollar", flag: "🇺🇸" },
	{ code: "EUR", name: "Euro", flag: "🇪🇺" },
	{ code: "GBP", name: "British Pound", flag: "🇬🇧" },
	{ code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
	{ code: "PKR", name: "Pakistani Rupee", flag: "🇵🇰" },
	{ code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
	{ code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
	{ code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
];

export default function CurrencyConverterApp() {
	const [from, setFrom] = useState("USD");
	const [to, setTo] = useState("EUR");
	const [amount, setAmount] = useState("100");
	const [result, setResult] = useState<number | null>(null);
	const [rate, setRate] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const convert = useCallback(async () => {
		const numAmount = parseFloat(amount);
		if (isNaN(numAmount) || numAmount < 0) {
			setError("Enter a valid amount");
			return;
		}
		if (from === to) {
			setResult(numAmount);
			setRate(1);
			setError("");
			return;
		}

		setLoading(true);
		setError("");
		try {
			const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
			if (!res.ok) throw new Error("Failed");
			const data = await res.json();
			
			if (data.result !== "success" || !data.rates?.[to]) {
				throw new Error("Unsupported currency pair");
			}
			const exchangeRate = data.rates[to];
			const converted = numAmount * exchangeRate;
			setResult(converted);
			setRate(exchangeRate);
		} catch {
			setError("Could not fetch exchange rates. Try again.");
			setResult(null);
			setRate(null);
		} finally {
			setLoading(false);
		}
	}, [amount, from, to]);

	useEffect(() => {
		const timer = setTimeout(convert, 300);
		return () => clearTimeout(timer);
	}, [convert]);

	const swapCurrencies = () => {
		setFrom(to);
		setTo(from);
		if (result !== null) setAmount(result.toFixed(2));
	};

	const fromCurrency = CURRENCIES.find((c) => c.code === from);
	const toCurrency = CURRENCIES.find((c) => c.code === to);

	return (
		<IdeasShell slug="currency-converter">
			<Card className="border-0 bg-white/15 shadow-2xl shadow-black/10 backdrop-blur-xl">
				<CardContent className="space-y-6 p-6 sm:p-8">
					<div className="space-y-2">
						<label className="text-sm font-medium text-white/80">Amount</label>
						<Input
							type="number"
							min="0"
							step="0.01"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							className="h-14 border-white/20 bg-white/10 text-2xl font-bold text-white placeholder:text-white/50 focus-visible:ring-white/30"
						/>
					</div>

					<div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
						<div className="space-y-2">
							<label className="text-sm font-medium text-white/80">From</label>
							<select
								title="From currency"
								value={from}
								onChange={(e) => setFrom(e.target.value)}
								className="h-12 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-white outline-none focus:ring-3 focus:ring-white/30"
							>
								{CURRENCIES.map((c) => (
									<option key={c.code} value={c.code} className="text-slate-900">
										{c.flag} {c.code} — {c.name}
									</option>
								))}
							</select>
						</div>

						<Button
							type="button"
							onClick={swapCurrencies}
							className="mx-auto h-12 w-12 shrink-0 rounded-full border-0 bg-white/25 p-0 text-white hover:rotate-180 hover:bg-white/35 transition-transform duration-500"
							aria-label="Swap currencies"
						>
							<ArrowLeftRight className="h-5 w-5" />
						</Button>

						<div className="space-y-2">
							<label className="text-sm font-medium text-white/80">To</label>
							<select
								title="To currency"
								value={to}
								onChange={(e) => setTo(e.target.value)}
								className="h-12 w-full rounded-lg border border-white/20 bg-white/10 px-3 text-white outline-none focus:ring-3 focus:ring-white/30"
							>
								{CURRENCIES.map((c) => (
									<option key={c.code} value={c.code} className="text-slate-900">
										{c.flag} {c.code} — {c.name}
									</option>
								))}
							</select>
						</div>
					</div>

					{error && (
						<p className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-white">
							{error}
						</p>
					)}

					<div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm animate-in fade-in duration-500">
						{loading ? (
							<div className="flex items-center justify-center gap-2 py-4 text-white/80">
								<Loader2 className="h-5 w-5 animate-spin" />
								<span>Fetching live rates...</span>
							</div>
						) : result !== null ? (
							<div className="text-center">
								<p className="text-sm text-white/70">
									{fromCurrency?.flag} {amount} {from} =
								</p>
								<p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl animate-in zoom-in-95 duration-300">
									{toCurrency?.flag} {result.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
									{to}
								</p>
								{rate !== null && (
									<div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
										<TrendingUp className="h-3.5 w-3.5" />
										1 {from} = {rate.toFixed(4)} {to}
									</div>
								)}
							</div>
						) : (
							<p className="py-4 text-center text-white/70">
								Enter an amount to convert
							</p>
						)}
					</div>
				</CardContent>
			</Card>
		</IdeasShell>
	);
}
