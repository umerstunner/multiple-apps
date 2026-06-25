"use client";

import { useCallback, useState } from "react";
import { Check, Copy, RefreshCw, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import IdeasShell from "../_components/ideas-shell";

function randomHexColor() {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function getContrastColor(hex: string) {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5 ? "#1e1e1e" : "#ffffff";
}

export default function ColorFlipperApp() {
	const [color, setColor] = useState("#8B5CF6");
	const [history, setHistory] = useState<string[]>(["#8B5CF6"]);
	const [copied, setCopied] = useState(false);

	const flipColor = useCallback(() => {
		const newColor = randomHexColor();
		setColor(newColor);
		setHistory((prev) => [newColor, ...prev.slice(0, 5)]);
		setCopied(false);
	}, []);

	const copyColor = async () => {
		await navigator.clipboard.writeText(color);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const textColor = getContrastColor(color);

	return (
		<IdeasShell slug="color-flipper">
			<div className="flex flex-1 flex-col gap-6">
				<div
					className="relative flex min-h-70 flex-1 flex-col items-center justify-center rounded-2xl shadow-2xl shadow-black/20 transition-all duration-700 ease-out animate-in zoom-in-95"
					style={{ backgroundColor: color }}
				>
					<p
						className="text-sm font-medium uppercase tracking-[0.3em] opacity-70 transition-colors duration-700"
						style={{ color: textColor }}
					>
						Current Color
					</p>
					<p
						className="mt-3 font-mono text-4xl font-bold tracking-wider transition-colors duration-700 sm:text-5xl"
						style={{ color: textColor }}
					>
						{color}
					</p>
					<div className="mt-6 flex gap-3">
						<Button
							onClick={flipColor}
							className="h-11 gap-2 border-0 px-6 shadow-lg transition-transform hover:scale-105"
							style={{
								backgroundColor: textColor,
								color: color,
							}}
						>
							<Shuffle className="h-4 w-4" />
							Flip Color
						</Button>
						<Button
							onClick={copyColor}
							variant="outline"
							className="h-11 gap-2 border-2 bg-transparent px-6 transition-transform hover:scale-105"
							style={{
								borderColor: textColor,
								color: textColor,
							}}
						>
							{copied ? (
								<>
									<Check className="h-4 w-4" /> Copied!
								</>
							) : (
								<>
									<Copy className="h-4 w-4" /> Copy
								</>
							)}
						</Button>
					</div>
					<RefreshCw
						className="absolute right-6 top-6 h-8 w-8 opacity-20 animate-spin animation-duration-[8s]"
						style={{ color: textColor }}
					/>
				</div>

				<Card className="border-0 bg-white/15 shadow-xl backdrop-blur-xl">
					<CardContent className="p-5">
						<p className="mb-3 text-sm font-medium text-white/80">Recent colors</p>
						<div className="flex flex-wrap gap-3">
							{history.map((c, i) => (
								<button
									key={`${c}-${i}`}
									type="button"
									onClick={() => {
										setColor(c);
										setCopied(false);
									}}
									className="group relative h-14 w-14 rounded-xl shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg animate-in fade-in slide-in-from-bottom-2"
									style={{
										backgroundColor: c,
										animationDelay: `${i * 75}ms`,
									}}
									aria-label={`Select color ${c}`}
								>
									{c === color && (
										<Check
											className="absolute inset-0 m-auto h-5 w-5"
											style={{ color: getContrastColor(c) }}
										/>
									)}
								</button>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</IdeasShell>
	);
}
