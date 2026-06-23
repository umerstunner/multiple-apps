"use client";

import { JobApplication, Column } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import {
	Building2,
	DollarSign,
	Edit2,
	ExternalLink,
	GripVertical,
	MapPin,
	MoreVertical,
	StickyNote,
	Trash2,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
	deleteJobApplication,
	updateJobApplication,
} from "@/lib/actions/job-applications";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import React, { useState } from "react";

interface JobApplicationCardProps {
	job: JobApplication;
	columns: Column[];
	dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

function normalizeTags(value: string) {
	return value
		.split(",")
		.map((tag) => tag.trim())
		.filter((tag) => tag.length > 0);
}

export default function JobApplicationCard({
	job,
	columns,
	dragHandleProps,
}: JobApplicationCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		company: job.company,
		position: job.position,
		location: job.location || "",
		notes: job.notes || "",
		salary: job.salary || "",
		jobUrl: job.jobUrl || "",
		columnId: job.columnId || "",
		tags: job.tags?.join(", ") || "",
		description: job.description || "",
	});

	async function handleUpdate(e: React.FormEvent) {
		e.preventDefault();
		setError("");
		setIsSaving(true);

		try {
			const result = await updateJobApplication(job._id, {
				...formData,
				tags: normalizeTags(formData.tags),
			});

			if (result.error) {
				setError(result.error);
			} else {
				setIsEditing(false);
			}
		} catch (err) {
			setError("Failed to update this application.");
			console.error("Failed to update job application: ", err);
		} finally {
			setIsSaving(false);
		}
	}

	async function handleDelete() {
		setError("");
		setIsDeleting(true);

		try {
			const result = await deleteJobApplication(job._id);

			if (result.error) {
				setError(result.error);
			}
		} catch (err) {
			setError("Failed to delete this application.");
			console.error("Failed to delete job application: ", err);
		} finally {
			setIsDeleting(false);
		}
	}

	async function handleMove(newColumnId: string) {
		try {
			const result = await updateJobApplication(job._id, {
				columnId: newColumnId,
			});

			if (result.error) {
				setError(result.error);
			}
		} catch (err) {
			setError("Failed to move this application.");
			console.error("Failed to move job application: ", err);
		}
	}

	return (
		<>
			<Card className="group border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
				<CardContent className="p-4">
					<div className="flex items-start justify-between gap-2">
						<button
							className="mt-0.5 cursor-grab rounded-md p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500 active:cursor-grabbing"
							aria-label="Drag job card"
							{...dragHandleProps}
						>
							<GripVertical className="h-4 w-4" />
						</button>
						<div className="min-w-0 flex-1">
							<h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-950">
								{job.position}
							</h3>
							<p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
								<Building2 className="h-3.5 w-3.5 text-primary" />
								<span className="truncate">{job.company}</span>
							</p>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={(props) => (
									<Button
										{...props}
										variant="ghost"
										size="icon"
										className="h-7 w-7 text-slate-500 hover:bg-slate-100"
									>
										<MoreVertical className="h-4 w-4" />
									</Button>
								)}
							/>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => setIsEditing(true)}>
									<Edit2 className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
								{columns
									.filter((c) => c._id !== job.columnId)
									.map((column) => (
										<DropdownMenuItem
											key={column._id}
											onClick={() => handleMove(column._id)}
										>
											Move to {column.name}
										</DropdownMenuItem>
									))}
								<DropdownMenuItem
									className="text-destructive"
									onClick={handleDelete}
									disabled={isDeleting}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									{isDeleting ? "Deleting..." : "Delete"}
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{job.description && (
						<p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-600">
							{job.description}
						</p>
					)}

					<div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
						{job.location && (
							<span className="inline-flex max-w-full items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
								<MapPin className="h-3 w-3" />
								<span className="truncate">{job.location}</span>
							</span>
						)}
						{job.salary && (
							<span className="inline-flex max-w-full items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-emerald-700">
								<DollarSign className="h-3 w-3" />
								<span className="truncate">{job.salary}</span>
							</span>
						)}
						{job.notes && (
							<span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-amber-700">
								<StickyNote className="h-3 w-3" />
								Notes
							</span>
						)}
					</div>

					{job.tags && job.tags.length > 0 && (
						<div className="mt-3 flex flex-wrap gap-1.5">
							{job.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
								>
									{tag}
								</span>
							))}
						</div>
					)}

					{job.jobUrl && (
						<a
							href={job.jobUrl}
							target="_blank"
							rel="noreferrer"
							className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
						>
							<ExternalLink className="h-3.5 w-3.5" />
							Open posting
						</a>
					)}
					{error && <p className="mt-3 text-xs text-destructive">{error}</p>}
				</CardContent>
			</Card>

			<Dialog open={isEditing} onOpenChange={setIsEditing}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Job Application</DialogTitle>
						<DialogDescription>
							Update role details, notes, and tracking context.
						</DialogDescription>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleUpdate}>
						{error && (
							<div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
								{error}
							</div>
						)}
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor={`company-${job._id}`}>Company *</Label>
								<Input
									id={`company-${job._id}`}
									required
									value={formData.company}
									onChange={(e) =>
										setFormData({ ...formData, company: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`position-${job._id}`}>Position *</Label>
								<Input
									id={`position-${job._id}`}
									required
									value={formData.position}
									onChange={(e) =>
										setFormData({ ...formData, position: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor={`location-${job._id}`}>Location</Label>
								<Input
									id={`location-${job._id}`}
									placeholder="Remote, Lahore, New York..."
									value={formData.location}
									onChange={(e) =>
										setFormData({ ...formData, location: e.target.value })
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={`salary-${job._id}`}>Salary</Label>
								<Input
									id={`salary-${job._id}`}
									placeholder="e.g., $100k - $150k"
									value={formData.salary}
									onChange={(e) =>
										setFormData({ ...formData, salary: e.target.value })
									}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`jobUrl-${job._id}`}>Job URL</Label>
							<Input
								id={`jobUrl-${job._id}`}
								type="url"
								placeholder="https://..."
								value={formData.jobUrl}
								onChange={(e) =>
									setFormData({ ...formData, jobUrl: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`tags-${job._id}`}>Tags</Label>
							<Input
								id={`tags-${job._id}`}
								placeholder="React, Remote, High priority"
								value={formData.tags}
								onChange={(e) =>
									setFormData({ ...formData, tags: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`description-${job._id}`}>Description</Label>
							<Textarea
								id={`description-${job._id}`}
								rows={3}
								placeholder="What makes this role worth tracking?"
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={`notes-${job._id}`}>Notes</Label>
							<Textarea
								id={`notes-${job._id}`}
								rows={4}
								placeholder="Recruiter name, follow-up date, interview prep..."
								value={formData.notes}
								onChange={(e) =>
									setFormData({ ...formData, notes: e.target.value })
								}
							/>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsEditing(false)}
								disabled={isSaving}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSaving}>
								{isSaving ? "Saving..." : "Save Changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
}
