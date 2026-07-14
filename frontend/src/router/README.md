# Router Directory

## Purpose

Centralizes all React Router configuration to keep the root `App.tsx` clean and maintainable.

## Responsibilities

- Maps URL paths to React page components.
- Enforces route protection (`ProtectedRoute`).
- Groups logical route trees (Auth, Public, Admin).

## How to Extend

To add new routes, modify `index.tsx`. If the file becomes too large, split the routes into separate constant arrays (e.g., `adminRoutes.tsx`, `authRoutes.tsx`) and compose them inside the main `AppRouter`.
