"use client";
import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutBtn from "./sign-out-btn";
import { useSession } from "@/lib/auth/auth-client";

export default function Navbar() {
	const { data: session } = useSession();
	const initial = session?.user?.name?.[0]?.toUpperCase() || "U";

	return (
		<nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
			<div className="container mx-auto flex h-16 items-center justify-between px-4">
				<Link
					href="/"
					className="flex items-center gap-2 text-lg font-semibold text-slate-950"
				>
					<span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/25">
						<BriefcaseBusiness className="h-5 w-5" />
					</span>
					Job Tracker
				</Link>
				<div className="flex items-center gap-2 sm:gap-4">
					{session?.user ? (
						<>
							<Link href="/dashboard">
								<Button variant="ghost" className="text-slate-700 hover:text-slate-950">
									Dashboard
								</Button>
							</Link>
							<DropdownMenu>
								<DropdownMenuTrigger
									render={(props) => (
										<Button {...props} variant="ghost" className="h-9 w-9 rounded-full p-0">
											<Avatar className="h-9 w-9 border border-primary/20">
												<AvatarFallback className="bg-primary text-white">
													{initial}
												</AvatarFallback>
											</Avatar>
										</Button>
									)}
								/>

								<DropdownMenuContent className="w-64" align="end">
									<DropdownMenuGroup>
										<DropdownMenuLabel className="font-normal">
											<div className="flex flex-col space-y-1">
												<p className="text-sm font-medium leading-none text-slate-950">
													{session.user.name}
												</p>
												<p className="truncate text-xs leading-none text-muted-foreground">
													{session.user.email}
												</p>
											</div>
										</DropdownMenuLabel>
									</DropdownMenuGroup>
									<SignOutBtn />
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<>
							<Link href="/sign-in">
								<Button variant="ghost" className="text-slate-700 hover:text-slate-950">
									Log In
								</Button>
							</Link>
							<Link href="/sign-up">
								<Button>Start for free</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
