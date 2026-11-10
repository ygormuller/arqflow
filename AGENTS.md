# Repository Guidelines

## Project Structure & Module Organization

This repository is a portable frontend prototype built with React, TypeScript, and Vite. Application code lives in `src/`: `App.tsx` contains the main UI and in-memory demo behavior, `main.tsx` initializes React, and `index.css` contains global styles. Static assets and the route inventory belong in `public/` (currently `routes.json`). Root files configure Vite, TypeScript, and the production container (`Dockerfile`, `nginx.conf`). There is no separate test directory or backend.

## Build, Test, and Development Commands

Use Node.js 20+ with npm 10+ or pnpm 9+.

- `npm install` installs dependencies; `pnpm install` uses the checked-in lockfile.
- `npm run dev` starts Vite on port 3000, listening on all interfaces.
- `npm run check` runs TypeScript type checking without emitting files.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the built bundle locally for review.

Run `check` and `build` before submitting UI or TypeScript changes. No automated test script is currently configured.

## Coding Style & Naming Conventions

Follow the existing TypeScript and React style: two spaces for indentation, double quotes, semicolons, and trailing commas in multiline structures. Use `.tsx` for components, PascalCase for component and type names, and camelCase for variables, functions, and properties. Keep UI labels consistent with the prototype’s Portuguese language. Prefer explicit TypeScript types and small, focused React components; keep styling in `src/index.css` unless a component-specific pattern already exists. There is no configured formatter or linter.

## Testing Guidelines

There is no test framework or coverage threshold in this repository. Validate changes with `npm run check` and `npm run build`, then use `npm run dev` to inspect affected screens and interactions in a browser. If tests are introduced, add the test command and framework to `package.json` and document the naming convention here.

## Commits and Pull Requests

Git history is unavailable in this checkout, so no established commit format can be confirmed. Write concise imperative commit subjects (for example, `Improve delivery approval flow`). Pull requests should summarize user-visible changes, list validation commands run, link related work when applicable, and include screenshots for visual changes.

## Scope and Configuration

This prototype uses fictitious in-memory data; it has no authentication, persistence, or external service integration. Keep secrets and machine-specific configuration out of the repository, and preserve its standalone frontend scope unless the project plan explicitly changes.
