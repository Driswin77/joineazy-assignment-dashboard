# Joineazy Assignment & Review Dashboard

A React frontend for managing student assignments and tracking submission progress. It has two
separate experiences — one for students and one for professors — with `localStorage` used for
mock persistence since the task does not require a backend.

## Overview

Students see only their own assignments, can open a submission link, and confirm a submission
through a two-step verification flow. Professors create and manage assignments, attach an external
submission link, and see the submission status of every student on each assignment, with individual
progress bars.

## Features

**Student**

- Login with a demo student account
- Dashboard with summary cards (total, completed, pending, completion rate)
- Animated overall progress bar calculated from submission data
- Assignment list with search and filters (all / pending / completed / overdue)
- Assignment details page with instructions, marks, due date and the external submission link
- Double-verification submission flow: "Yes, I have submitted" → final confirmation
- Progress and dashboard statistics update immediately after confirming
- Profile page with personal details and completion summary

**Admin / Professor**

- Login with a demo admin account
- Dashboard with totals, submitted/pending rates and a submission overview per assignment
- Assignment management table with view, edit and delete (with confirmation)
- Create / edit assignment form with validation and student selection
- Per-assignment student tracking: search, filter, overall progress bar, submission status
- Students page with overall completion for each student
- Reviews page listing every recorded submission
- Settings page with a "reset demo data" action

**Shared**

- Role-based routing and navigation
- Notifications panel driven by real assignment/submission data
- Toast notifications for login, creation, updates, deletions and confirmations
- Empty states, loading feedback and form error handling
- Fully responsive from 390px up to 1440px+

## Tech Stack

- React 18 (function components + hooks)
- React Router 6
- Tailwind CSS 3
- JavaScript (ES modules)
- Vite
- localStorage for persistence
- lucide-react for icons

No backend. No database. All data is mock data.

## Demo Accounts

**Student**

## Round 2 Enhancements

- Course-first dashboards for both roles — click a course to open its assignments
- Submission types: Individual and Group
- Group leader acknowledgment — when the leader submits, all members are marked as submitted
- Group member panel on the assignment page with per-member status
- "Not in a group" and "Waiting for leader" states for group assignments