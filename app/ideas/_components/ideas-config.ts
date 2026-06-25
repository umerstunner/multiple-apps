export const IDEAS = [
	{
		slug: "weather",
		title: "Weather App",
		description: "Live forecasts for cities worldwide",
		gradient: "from-sky-400 via-blue-500 to-indigo-600",
		accent: "text-sky-100",
	},
	{
		slug: "currency-converter",
		title: "Currency Converter",
		description: "Real-time exchange rates",
		gradient: "from-emerald-400 via-teal-500 to-cyan-600",
		accent: "text-emerald-100",
	},
	{
		slug: "color-flipper",
		title: "Color Flipper",
		description: "Discover random vibrant palettes",
		gradient: "from-fuchsia-500 via-purple-500 to-violet-600",
		accent: "text-fuchsia-100",
	},
	{
		slug: "date-time",
		title: "Date & Time",
		description: "Live clocks across time zones",
		gradient: "from-orange-400 via-amber-500 to-yellow-500",
		accent: "text-orange-100",
	},
	{
		slug: "dark-light-theme",
		title: "Theme Swapper",
		description: "Toggle dark and light modes",
		gradient: "from-slate-600 via-zinc-700 to-neutral-800",
		accent: "text-slate-200",
	},
	{
		slug: "age-calculator",
		title: "Age Calculator",
		description: "Precise age and birthday countdown",
		gradient: "from-rose-400 via-pink-500 to-red-500",
		accent: "text-rose-100",
	},
] as const;

export type IdeaSlug = (typeof IDEAS)[number]["slug"];

export function getIdeaBySlug(slug: string) {
	return IDEAS.find((idea) => idea.slug === slug);
}

export function getNextIdea(slug: string) {
	const index = IDEAS.findIndex((idea) => idea.slug === slug);
	if (index === -1) return IDEAS[0];
	return IDEAS[(index + 1) % IDEAS.length];
}

export function getIdeaIndex(slug: string) {
	const index = IDEAS.findIndex((idea) => idea.slug === slug);
	return index === -1 ? 0 : index;
}
