# Repository Guidelines

## Project Structure & Module Organization

This repository is a portable frontend prototype built with React, TypeScript, and Vite. Application code lives in `src/`: `main.tsx` initializes React, `App.tsx` composes the screens and manages app-level UI state, and `index.css` contains global styles. The delivery workflow is organized in `src/features/deliveries/`: `model.ts` defines delivery, version, and decision types; `data.ts` contains fictitious initial data; and `flow.ts` contains the pure state reducer and workflow rules. The reducer is connected to the UI through React state in `App.tsx`.

Static assets and the route inventory belong in `public/` (currently `routes.json`). Root files configure Vite, TypeScript, and the production container (`Dockerfile`, `nginx.conf`). The application is frontend-only: there is no backend, authentication, persistent storage, or automated test framework. Demo state is held in memory and resets when the page reloads.

## Build, Test, and Development Commands

Use Node.js 20.19+ or 22.12+ with npm 10+ or pnpm 9+ (matching the installed Vite 7 runtime requirement).

- `npm install` installs dependencies; `pnpm install` uses the checked-in lockfile.
- `npm run dev` starts Vite on port 3000, listening on all interfaces.
- `npm run check` runs TypeScript type checking without emitting files.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the built bundle locally for review.

Run `check` and `build` before submitting UI or TypeScript changes. No automated test script is currently configured.

## Coding Style & Naming Conventions

Follow the existing TypeScript and React style: two spaces for indentation, double quotes, semicolons, and trailing commas in multiline structures. Use `.tsx` for components, PascalCase for component and type names, and camelCase for variables, functions, and properties. Keep UI labels consistent with the prototype’s Portuguese language. Prefer explicit TypeScript types and small, focused React components; keep styling in `src/index.css` unless a component-specific pattern already exists. Keep delivery transition rules in `src/features/deliveries/flow.ts`, domain types in `model.ts`, and sample records in `data.ts`; UI components should invoke workflow actions through callbacks rather than implement state transitions. There is no configured formatter or linter.

## Testing Guidelines

There is no test framework or coverage threshold in this repository. Validate changes with `npm run check` and `npm run build`, then use `npm run dev` to inspect affected screens and interactions in a browser. For delivery workflow changes, preserve the rules that decisions apply to one version, a version may be decided only once, change requests require a non-empty comment, and a newly published revision starts in `Aguardando aprovação` while prior versions and decisions remain in history. If tests are introduced, add the test command and framework to `package.json` and document the naming convention here.

## Commits and Pull Requests

Git history is unavailable in this checkout, so no established commit format can be confirmed. Write concise imperative commit subjects (for example, `Improve delivery approval flow`). Pull requests should summarize user-visible changes, list validation commands run, link related work when applicable, and include screenshots for visual changes.

## Scope and Configuration

This prototype uses fictitious in-memory data; it has no authentication, persistence, or external service integration. The delivery reducer enforces workflow rules locally but is not a security or concurrency boundary. Keep secrets and machine-specific configuration out of the repository, and preserve its standalone frontend scope unless the project plan explicitly changes.
