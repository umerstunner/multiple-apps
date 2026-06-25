"use client";

import { useCallback, useState } from "react";
import {
	Cloud,
	CloudRain,
	CloudSun,
	Droplets,
	Loader2,
	MapPin,
	Search,
	Sun,
	Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import IdeasShell from "../_components/ideas-shell";

type WeatherData = {
	city: string;
	country: string;
	temperature: number;
	feelsLike: number;
	humidity: number;
	windSpeed: number;
	weatherCode: number;
};

function getWeatherIcon(code: number) {
	if (code === 0) return Sun;
	if (code <= 3) return CloudSun;
	if (code <= 67) return CloudRain;
	return Cloud;
}

function getWeatherLabel(code: number) {
	if (code === 0) return "Clear sky";
	if (code <= 3) return "Partly cloudy";
	if (code <= 48) return "Foggy";
	if (code <= 67) return "Rainy";
	if (code <= 77) return "Snowy";
	if (code <= 82) return "Rain showers";
	return "Stormy";
}

export default function WeatherApp() {
	const [city, setCity] = useState("London");
	const [query, setQuery] = useState("");
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const fetchWeather = useCallback(async (searchCity: string) => {
		setLoading(true);
		setError("");
		try {
			const geoRes = await fetch(
				`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchCity)}&count=1`,
			);
			const geoData = await geoRes.json();
			if (!geoData.results?.length) {
				setError("City not found. Try another name.");
				setWeather(null);
				return;
			}

			const { latitude, longitude, name, country } = geoData.results[0];
			const weatherRes = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`,
			);
			const weatherData = await weatherRes.json();
			const current = weatherData.current;

			setWeather({
				city: name,
				country,
				temperature: Math.round(current.temperature_2m),
				feelsLike: Math.round(current.apparent_temperature),
				humidity: current.relative_humidity_2m,
				windSpeed: Math.round(current.wind_speed_10m),
				weatherCode: current.weather_code,
			});
			setCity(name);
		} catch {
			setError("Unable to fetch weather. Check your connection.");
			setWeather(null);
		} finally {
			setLoading(false);
		}
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim()) fetchWeather(query.trim());
	};

	const WeatherIcon = weather ? getWeatherIcon(weather.weatherCode) : CloudSun;

	return (
		<IdeasShell slug="weather">
			<Card className="border-0 bg-white/15 shadow-2xl shadow-black/10 backdrop-blur-xl">
				<CardContent className="p-6 sm:p-8">
					<form onSubmit={handleSearch} className="flex gap-2">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
							<Input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search city..."
								className="h-11 border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/50 focus-visible:ring-white/30"
							/>
						</div>
						<Button
							type="submit"
							disabled={loading}
							className="h-11 border-0 bg-white/25 px-6 text-white hover:bg-white/35"
						>
							{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
						</Button>
					</form>

					{error && (
						<p className="mt-4 rounded-lg bg-red-500/20 px-4 py-2 text-sm text-white">
							{error}
						</p>
					)}

					{!weather && !loading && !error && (
						<div className="mt-10 text-center">
							<CloudSun className="mx-auto h-20 w-20 animate-bounce text-white/80" />
							<p className="mt-4 text-lg text-white/80">
								Search for a city to see live weather
							</p>
							<Button
								type="button"
								variant="outline"
								className="mt-4 border-white/30 bg-transparent text-white hover:bg-white/10"
								onClick={() => fetchWeather("London")}
							>
								Try London
							</Button>
						</div>
					)}

					{weather && (
						<div className="mt-8 animate-in fade-in zoom-in-95 duration-500">
							<div className="flex items-start justify-between">
								<div>
									<div className="flex items-center gap-2 text-white/80">
										<MapPin className="h-4 w-4" />
										<span>
											{weather.city}, {weather.country}
										</span>
									</div>
									<p className="mt-4 text-7xl font-bold tracking-tighter text-white sm:text-8xl">
										{weather.temperature}°
									</p>
									<p className="mt-2 text-xl text-white/90">
										{getWeatherLabel(weather.weatherCode)}
									</p>
									<p className="text-sm text-white/70">
										Feels like {weather.feelsLike}°
									</p>
								</div>
								<WeatherIcon className="h-24 w-24 animate-pulse text-white/90 sm:h-32 sm:w-32" />
							</div>

							<div className="mt-8 grid grid-cols-2 gap-4">
								<div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-transform hover:scale-[1.02]">
									<div className="flex items-center gap-2 text-white/70">
										<Droplets className="h-4 w-4" />
										<span className="text-sm">Humidity</span>
									</div>
									<p className="mt-1 text-2xl font-semibold text-white">
										{weather.humidity}%
									</p>
								</div>
								<div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-transform hover:scale-[1.02]">
									<div className="flex items-center gap-2 text-white/70">
										<Wind className="h-4 w-4" />
										<span className="text-sm">Wind</span>
									</div>
									<p className="mt-1 text-2xl font-semibold text-white">
										{weather.windSpeed} km/h
									</p>
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</IdeasShell>
	);
}
