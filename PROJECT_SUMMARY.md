# Job Tracker Project Summary

## Overview
Job Tracker is a Next.js application for managing a personal job search pipeline. Users can sign up, sign in, and track job applications across a Kanban-style board named "Job Hunt". Each application can store company, position, location, salary, posting URL, tags, description, and notes.

## Tech Stack
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn-style UI components
- lucide-react icons
- better-auth for authentication
- MongoDB and Mongoose for persistence
- dnd-kit for drag-and-drop Kanban interactions

## Main Folders
- `app/`: Next.js routes for home, dashboard, auth pages, global styles, and API auth route.
- `components/`: Shared UI, navbar, Kanban board, job cards, image tabs, and job creation dialog.
- `lib/actions/`: Server actions for creating, updating, moving, and deleting job applications.
- `lib/auth/`: better-auth server and client setup.
- `lib/models/`: Board, column, and job application models plus TypeScript types.
- `lib/hooks/`: Client-side board state and optimistic job movement logic.
- `scripts/`: Seed script for creating sample job data.
- `public/`: Static images and icons.

## Current User Flow
1. A visitor lands on the marketing page and can sign up or sign in.
2. Authenticated users open `/dashboard`.
3. The dashboard loads the user's "Job Hunt" board from MongoDB.
4. Users add job applications to columns.
5. Users drag cards between columns or use card menu actions to move, edit, or delete applications.
6. Server actions persist changes and revalidate the dashboard.

## Enhancements Completed
- Redesigned the dashboard background, header, and loading fallback.
- Added dashboard metrics for total roles, interview-stage roles, offers, and saved job links.
- Added search across company, position, location, salary, tags, description, and notes.
- Added stage filters so users can focus on one pipeline column.
- Improved Kanban columns with stronger visual hierarchy, counts, empty states, and polished drop states.
- Improved job cards with a dedicated drag handle, richer metadata display, tags, salary, location, notes indicator, and posting links.
- Added loading and error states for creating, editing, deleting, and moving jobs.
- Improved add/edit dialogs with responsive layouts, clearer copy, better placeholders, and scroll-safe modal content.
- Improved the landing page with a stronger product hero, dashboard preview, and feature section.
- Polished the sticky navbar and authenticated user menu.
- Polished sign-in and sign-up pages and fixed corrupted password placeholder text.

## Key Files Changed
- `app/dashboard/page.tsx`
- `components/KanbanBoard.tsx`
- `components/job-application-card.tsx`
- `components/create-job-dialog.tsx`
- `components/navbar.tsx`
- `app/page.tsx`
- `app/sign-in/page.tsx`
- `app/sign-up/page.tsx`
- `PROJECT_SUMMARY.md`

## Verification
- `tsc --noEmit` passed successfully.
- `npm.cmd run lint` was attempted, but the command timed out without returning output.
- `npm.cmd run build` was attempted, but the command timed out without returning output.
- Initial `npm run lint` was blocked by the local PowerShell execution policy for `npm.ps1`, so `npm.cmd` was used afterward.

## Notes And Future Ideas
- Column deletion is visible in the menu but still needs a server action before it should be considered functional.
- A due-date or follow-up reminder field would make the tracker more useful for real job search workflows.
- A confirmation dialog before deleting job applications would reduce accidental deletion risk.
- Toast notifications would improve feedback after create, update, move, and delete actions.
- Board and column customization could make the app useful beyond the default "Job Hunt" board.
