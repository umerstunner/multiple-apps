import { getSession } from "@/lib/auth/auth";
import connectDB from "@/lib/db";
import { Board } from "@/lib/models";
import { redirect } from "next/navigation";
import KanbanBoard from "@/components/KanbanBoard";
import { Suspense } from "react";

async function getBoard(userId: string) {
	"use cache";

	await connectDB();

	const boardDoc = await Board.findOne({
		userId: userId,
		name: "Job Hunt",
	}).populate({
		path: "columns",
		populate: {
			path: "jobApplications",
		},
	});

	if (!boardDoc) return null;

	const board = JSON.parse(JSON.stringify(boardDoc));

	return board;
}

async function DashboardPage() {
	const session = await getSession();

	if (!session?.user) {
		redirect("/sign-in");
	}

	const board = await getBoard(session.user.id);

	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#fff7fa_0%,#ffffff_34%,#f8fafc_100%)]">
			<div className="container mx-auto px-4 py-8 sm:px-6">
				<div className="mb-8 flex flex-col gap-3">
					<p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
						Dashboard
					</p>
					<h1 className="text-4xl font-bold text-slate-950 sm:text-5xl">
						Job Hunt
					</h1>
					<p className="max-w-2xl text-base text-slate-600">
						Track every opportunity from first application to final decision
						with a focused, draggable pipeline.
					</p>
				</div>
				<KanbanBoard board={board} userId={session.user.id} />
			</div>
		</div>
	);
}

export default async function Dashboard() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-slate-50 p-8">
					<div className="mx-auto h-40 max-w-6xl animate-pulse rounded-lg bg-white shadow-sm" />
				</div>
			}
		>
			<DashboardPage />
		</Suspense>
	);
}
