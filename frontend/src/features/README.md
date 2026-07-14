# Features Directory

## Purpose

The `features/` directory implements a feature-sliced architecture. Instead of grouping files by type (e.g., all hooks together, all components together), we group them by the **business feature** they belong to.

## Responsibilities

Each subfolder within `features/` acts as an independent module. It should contain its own components, hooks, types, services, and utilities.

## Folder Structure

```text
features/
├── ai/                # AI and Operations Copilot functionality
├── auth/              # Unified authentication flows (Admin, Fan, Staff)
├── command-center/    # Admin Dashboard widget components
└── digital-twin/      # Stadium Digital Twin and live simulation logic
```

## How to Extend

To add a new feature (e.g., `ticketing`), create a new folder `features/ticketing/` and place all ticketing-specific React components, GraphQL/REST API services, and custom hooks inside it. Avoid importing internal components from one feature directly into another to minimize tight coupling.
