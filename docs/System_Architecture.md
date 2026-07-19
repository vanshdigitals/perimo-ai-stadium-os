# PERIMO System Architecture

## Overview
PERIMO (AI Stadium OS) is a comprehensive platform designed for the FIFA World Cup 2026, encompassing a full Fan Experience, Staff Operations Portal, and Command Center.

## System Components
1. **Frontend**: React-based SPA using Vite, TailwindCSS, and Framer Motion. Built with a feature-first component architecture.
2. **Backend**: FastAPI (Python) service using a domain-driven layered architecture.
3. **Database**: SQLite (via SQLAlchemy) for relational data and real-time state.
4. **Real-time Engine**: WebSocket-based event bus for live updates.

## Backend Architecture (Domain-Driven)
- outers/: API route definitions and endpoint handlers. Thin layer parsing HTTP requests.
- services/: Core business logic and use-case execution.
- epositories/: Data access layer and database interactions.
- schemas/: Pydantic validation models.
- models/: SQLAlchemy ORM definitions.

## Frontend Architecture (Feature-First)
- src/features/{domain}: Contains components, hooks, services, and API definitions specific to a business domain.
- src/components/ui: Shared, purely presentational UI components.
- src/pages: Top-level route entry points that compose layout and feature components.