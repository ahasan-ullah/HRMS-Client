# HRMS Client

> A modern Angular frontend for managing people, payroll, compensation, and role-based access in one place.

## Overview

HRMS Client is the frontend for an HR management system built with Angular 17. It provides a clean dashboard experience for Admin, HR, and Employee roles, with routed modules for employees, departments, salary, payroll, bonuses, deductions, users, and authentication.

The app is designed as a standalone Angular frontend with HTTP interceptors, route guards, lazy-loaded feature areas, and a shared layout shell.

## Key Features

- Role-based dashboard views for Admin, HR, and Employee users.
- Employee, department, salary, bonus, deduction, payroll, and user management screens.
- Protected routes with auth and role guards.
- Centralized HTTP handling with token attachment and API response casing normalization.
- Shared application shell with header, sidebar, layout, and toast notifications.
- Proxy-based local development setup for backend API integration.

## Tech Stack

- Angular 17
- TypeScript
- RxJS
- Angular Router
- Angular Forms
- Jasmine and Karma
- Tabler Icons

## Project Structure

```text
src/
	app/
		core/
			guards/
			interceptors/
			models/
			services/
		features/
			auth/
			dashboard/
			employees/
			departments/
			salary/
			payroll/
			bonuses/
			deductions/
			users/
		shared/
			components/
			services/
			styles/
	assets/
	environments/
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- Angular CLI 17

### Install Dependencies

```bash
npm install
```

### Run the App

```bash
npm start
```

The app runs at `http://localhost:4200/` and uses `proxy.conf.json` for backend API calls.

### Build for Production

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm start` | Starts the development server with the API proxy enabled. |
| `npm run build` | Builds the app into `dist/`. |
| `npm run watch` | Rebuilds on file changes in development mode. |
| `npm test` | Runs the unit test suite. |

## Architecture Notes

- Authentication state is stored locally and used by guards, interceptors, and layout UI.
- The app uses lazy-loaded feature routes to keep the initial bundle focused.
- API responses are normalized to camelCase on the client so feature components can bind consistently.
- The shared layout renders the main shell while feature modules handle their own page content.

## Environment

Environment-specific API URLs are configured in:

- `src/environments/environment.ts`
- `src/environments/environment.production.ts`

## Backend Integration

This frontend expects a backend that exposes endpoints for:

- authentication
- users
- employees
- departments
- salary
- payroll
- bonuses
- deductions
- dashboard

If the backend contract changes, update the matching service and model files in `src/app/core/`.

## Notes

- Login and dashboard flows rely on role-aware session data.
- Admin and HR users can access management features.
- Employees see their own dashboard data only.

## Further Help

Use `npm run ng -- help` or the [Angular CLI documentation](https://angular.dev/tools/cli) for additional commands and generation options.
