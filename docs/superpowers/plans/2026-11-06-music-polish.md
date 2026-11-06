# Music demo polish Implementation Plan

> **For agentic workers:** Implement inline, following the user-delegated design choices. No additional agents required.

**Goal:** A finished concert-led presentation with usable responsive account screens.

**Architecture:** Keep the existing React state, components and API module. Update markup and CSS only where presentation or accessibility needs it. Preserve all session and server contracts.

**Tech Stack:** React 19, TypeScript, Vite; no new runtime dependencies.

**Spec:** docs/design-2026-11-06.md

## Global Constraints

- Russian copy, short and factual; existing illustration only.
- No invented real-world music content or claims.
- No live API mutations during verification.
- Preserve registration, login, logout, profile editing, loading, validation and server errors.
- Mobile layout, keyboard focus and reduced motion required.

## Review Focus

- Narrow 320/390 px screens and long usernames must not overflow.
- Dialogs must remain scrollable and closable by keyboard.
- Loading and error messages must stay readable; pending actions stay disabled.
- Profile editing must retain the existing field mapping and validation.
- Decorative motion must respect reduced motion.

## Tasks

- [x] Update HomePage and App shell: concert-led identity, factual project information, clear profile CTA and navigation.
- [x] Update AuthDialog and ProfilePage presentation: descriptions, visual hierarchy and responsive field layouts while preserving handlers.
- [x] Replace CSS with cohesive tokens and responsive layouts; adjust document metadata.
- [x] Run npm test (8 existing API-contract tests) and npm run build; review desktop/mobile screenshots and mocked auth/profile interactions.
- [x] Record current checks in docs, inspect diff and commit locally without pushing or deploying.
