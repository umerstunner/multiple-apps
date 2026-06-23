"use client";

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import {
	Award,
	BriefcaseBusiness,
	Calendar,
	CheckCircle2,
	CircleDashed,
	ExternalLink,
	Filter,
	Mic,
	MoreVertical,
	Search,
	Sparkles,
	Trash2,
	XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";
import { useBoard } from "@/lib/hooks/useBoards";
import {
	closestCorners,
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ComponentType, ReactNode, useMemo, useState } from "react";

interface KanbanBoardProps {
	board: Board | null;
	userId: string;
}

interface ColConfig {
	accent: string;
	badge: string;
	icon: ReactNode;
}

const COLUMN_CONFIG: Array<ColConfig> = [
	{
		accent: "from-sky-500 to-cyan-500",
		badge: "bg-sky-50 text-sky-700 ring-sky-200",
		icon: <Calendar className="h-4 w-4" />,
	},
	{
		accent: "from-violet-500 to-fuchsia-500",
		badge: "bg-violet-50 text-violet-700 ring-violet-200",
		icon: <CheckCircle2 className="h-4 w-4" />,
	},
	{
		accent: "from-emerald-500 to-teal-500",
		badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
		icon: <Mic className="h-4 w-4" />,
	},
	{
		accent: "from-amber-400 to-orange-500",
		badge: "bg-amber-50 text-amber-800 ring-amber-200",
		icon: <Award className="h-4 w-4" />,
	},
	{
		accent: "from-rose-500 to-red-500",
		badge: "bg-rose-50 text-rose-700 ring-rose-200",
		icon: <XCircle className="h-4 w-4" />,
	},
];

function matchesJob(job: JobApplication, query: string) {
	if (!query) return true;

	const haystack = [
		job.company,
		job.position,
		job.location,
		job.salary,
		job.description,
		job.notes,
		...(job.tags || []),
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();

	return haystack.includes(query.toLowerCase());
}

function DroppableColumn({
	column,
	config,
	boardId,
	sortedColumns,
	jobs,
}: {
	column: Column;
	config: ColConfig;
	boardId: string;
	sortedColumns: Column[];
	jobs: JobApplication[];
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: column._id,
		data: {
			type: "column",
			columnId: column._id,
		},
	});

	return (
		<Card className="min-w-[19rem] max-w-[19rem] shrink-0 overflow-hidden border-slate-200 bg-white/95 p-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
			<CardHeader className="border-b border-slate-100 p-0">
				<div className={`h-1.5 bg-gradient-to-r ${config.accent}`} />
				<div className="flex items-center justify-between px-4 py-3">
					<div className="flex min-w-0 items-center gap-2">
						<span className={`rounded-md p-1.5 ring-1 ${config.badge}`}>
							{config.icon}
						</span>
						<div className="min-w-0">
							<CardTitle className="truncate text-sm font-semibold text-slate-950">
								{column.name}
							</CardTitle>
							<p className="text-xs text-slate-500">
								{jobs.length} {jobs.length === 1 ? "role" : "roles"}
							</p>
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger
							render={(props) => (
								<Button
									{...props}
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-slate-500 hover:bg-slate-100"
								>
									<MoreVertical className="h-4 w-4" />
								</Button>
							)}
						/>
						<DropdownMenuContent align="end">
							<DropdownMenuItem className="text-destructive">
								<Trash2 className="mr-2 h-4 w-4" />
								Delete Column
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardHeader>

			<CardContent
				ref={setNodeRef}
				className={`min-h-[28rem] space-y-3 bg-slate-50/70 p-3 transition ${
					isOver ? "ring-2 ring-primary/60" : ""
				}`}
			>
				<SortableContext
					items={jobs.map((job) => job._id)}
					strategy={verticalListSortingStrategy}
				>
					{jobs.map((job) => (
						<SortableJobCard
							key={job._id}
							job={{ ...job, columnId: job.columnId || column._id }}
							columns={sortedColumns}
						/>
					))}
				</SortableContext>

				{jobs.length === 0 && (
					<div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/70 px-4 text-center text-sm text-slate-500">
						<CircleDashed className="mb-2 h-5 w-5 text-slate-400" />
						No roles here yet
					</div>
				)}

				<CreateJobApplicationDialog columnId={column._id} boardId={boardId} />
			</CardContent>
		</Card>
	);
}

function SortableJobCard({
	job,
	columns,
}: {
	job: JobApplication;
	columns: Column[];
}) {
	const {
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
		setNodeRef,
	} = useSortable({
		id: job._id,
		data: {
			type: "job",
			job,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.45 : 1,
	};

	return (
		<div ref={setNodeRef} style={style}>
			<JobApplicationCard
				job={job}
				columns={columns}
				dragHandleProps={{ ...attributes, ...listeners }}
			/>
		</div>
	);
}

export default function KanbanBoard({ board }: KanbanBoardProps) {
	const [activeId, setActiveId] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [columnFilter, setColumnFilter] = useState("all");
	const { columns, moveJob } = useBoard(board);

	const sortedColumns = useMemo(
		() => [...(columns || [])].sort((a, b) => a.order - b.order),
		[columns],
	);

	const allJobs = useMemo(
		() =>
			sortedColumns.flatMap((col) =>
				[...(col.jobApplications || [])].map((job) => ({
					...job,
					columnId: job.columnId || col._id,
				})),
			),
		[sortedColumns],
	);

	const totalJobs = allJobs.length;
	const interviewJobs = allJobs.filter((job) =>
		/interview/i.test(
			sortedColumns.find((col) => col._id === job.columnId)?.name || "",
		),
	).length;
	const offerJobs = allJobs.filter((job) =>
		/offer/i.test(
			sortedColumns.find((col) => col._id === job.columnId)?.name || "",
		),
	).length;
	const jobsWithLinks = allJobs.filter((job) => job.jobUrl).length;

	const visibleColumns = sortedColumns
		.filter((col) => columnFilter === "all" || col._id === columnFilter)
		.map((col) => ({
			...col,
			jobApplications: [...(col.jobApplications || [])]
				.sort((a, b) => a.order - b.order)
				.filter((job) => matchesJob(job, query)),
		}));

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	async function handleDragStart(event: DragStartEvent) {
		setActiveId(event.active.id as string);
	}

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		setActiveId(null);

		if (!over || !board?._id) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		let draggedJob: JobApplication | null = null;
		let sourceColumn: Column | null = null;
		let sourceIndex = -1;

		for (const column of sortedColumns) {
			const jobs = [...(column.jobApplications || [])].sort(
				(a, b) => a.order - b.order,
			);
			const jobIndex = jobs.findIndex((j) => j._id === activeId);
			if (jobIndex !== -1) {
				draggedJob = jobs[jobIndex];
				sourceColumn = column;
				sourceIndex = jobIndex;
				break;
			}
		}

		if (!draggedJob || !sourceColumn) return;

		const targetColumn = sortedColumns.find((col) => col._id === overId);
		const targetJob = sortedColumns
			.flatMap((col) => col.jobApplications || [])
			.find((job) => job._id === overId);

		let targetColumnId: string;
		let newOrder: number;

		if (targetColumn) {
			targetColumnId = targetColumn._id;
			const jobsInTarget = [...(targetColumn.jobApplications || [])]
				.filter((j) => j._id !== activeId)
				.sort((a, b) => a.order - b.order);
			newOrder = jobsInTarget.length;
		} else if (targetJob) {
			const targetJobColumn = sortedColumns.find((col) =>
				(col.jobApplications || []).some((j) => j._id === targetJob._id),
			);
			targetColumnId = targetJob.columnId || targetJobColumn?._id || "";
			if (!targetColumnId) return;

			const targetColumnObj = sortedColumns.find(
				(col) => col._id === targetColumnId,
			);

			if (!targetColumnObj) return;

			const allJobsInTargetOriginal = [
				...(targetColumnObj.jobApplications || []),
			].sort((a, b) => a.order - b.order);

			const allJobsInTargetFiltered = allJobsInTargetOriginal.filter(
				(j) => j._id !== activeId,
			);

			const targetIndexInOriginal = allJobsInTargetOriginal.findIndex(
				(j) => j._id === overId,
			);

			const targetIndexInFiltered = allJobsInTargetFiltered.findIndex(
				(j) => j._id === overId,
			);

			if (targetIndexInFiltered !== -1) {
				if (sourceColumn._id === targetColumnId) {
					newOrder =
						sourceIndex < targetIndexInOriginal
							? targetIndexInFiltered + 1
							: targetIndexInFiltered;
				} else {
					newOrder = targetIndexInFiltered;
				}
			} else {
				newOrder = allJobsInTargetFiltered.length;
			}
		} else {
			return;
		}

		if (!targetColumnId) return;

		await moveJob(activeId, targetColumnId, newOrder);
	}

	const activeJob = allJobs.find((job) => job._id === activeId);
	type StatCard = {
		label: string;
		value: number;
		Icon: ComponentType<{ className?: string }>;
	};

	const statCards: StatCard[] = [
		{ label: "Total roles", value: totalJobs, Icon: BriefcaseBusiness },
		{ label: "Interview stage", value: interviewJobs, Icon: Mic },
		{ label: "Offers", value: offerJobs, Icon: Award },
		{ label: "Saved links", value: jobsWithLinks, Icon: ExternalLink },
	];

	if (!board) {
		return (
			<div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
				<BriefcaseBusiness className="mx-auto mb-4 h-10 w-10 text-primary" />
				<h2 className="text-xl font-semibold text-slate-950">No board found</h2>
				<p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
					Create or seed your Job Hunt board to start tracking applications.
				</p>
			</div>
		);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<div className="space-y-5">
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{statCards.map(({ label, value, Icon }) => (
						<div
							key={label}
							className="rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm"
						>
							<div className="flex items-center justify-between gap-3">
								<div>
									<p className="text-sm text-slate-500">{label}</p>
									<p className="mt-1 text-3xl font-bold text-slate-950">
										{value}
									</p>
								</div>
								<Icon className="h-5 w-5 text-primary" />
							</div>
						</div>
					))}
				</div>

				<div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white/95 p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
					<div className="relative min-w-0 flex-1">
						<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search company, title, location, tags, or notes"
							className="h-10 border-slate-200 pl-9"
						/>
					</div>
					<div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
						<span className="inline-flex items-center gap-1 whitespace-nowrap text-sm text-slate-500">
							<Filter className="h-4 w-4" /> Stage
						</span>
						<Button
							variant={columnFilter === "all" ? "default" : "outline"}
							size="sm"
							onClick={() => setColumnFilter("all")}
						>
							All
						</Button>
						{sortedColumns.map((column) => (
							<Button
								key={column._id}
								variant={columnFilter === column._id ? "default" : "outline"}
								size="sm"
								onClick={() => setColumnFilter(column._id)}
								className="whitespace-nowrap"
							>
								{column.name}
							</Button>
						))}
					</div>
				</div>

				{totalJobs === 0 && (
					<div className="rounded-lg border border-primary/20 bg-primary/5 p-5 text-sm text-slate-700">
						<div className="flex items-start gap-3">
							<Sparkles className="mt-0.5 h-5 w-5 text-primary" />
							<p>
								Start by adding your first job to any column. Add a link,
								tags, salary range, and notes so every follow-up has context.
							</p>
						</div>
					</div>
				)}

				<div className="flex gap-4 overflow-x-auto pb-5">
					{visibleColumns.map((col, index) => {
						const config = COLUMN_CONFIG[index] || {
							accent: "from-slate-500 to-slate-700",
							badge: "bg-slate-50 text-slate-700 ring-slate-200",
							icon: <Calendar className="h-4 w-4" />,
						};
						return (
							<DroppableColumn
								key={col._id}
								column={col}
								config={config}
								boardId={board._id}
								sortedColumns={sortedColumns}
								jobs={col.jobApplications}
							/>
						);
					})}
				</div>
			</div>

			<DragOverlay>
				{activeJob ? (
					<div className="rotate-1 opacity-90 shadow-2xl">
						<JobApplicationCard job={activeJob} columns={sortedColumns} />
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}


