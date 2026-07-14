# Components Directory

## Purpose

The `components/` directory is reserved for **global, reusable, presentational UI components**.

## Responsibilities

Components here should be "dumb" components. They should not contain business logic, should not fetch data from external APIs, and should not be tied to a specific feature.

## Folder Structure

```text
components/
├── layouts/           # Global page wrappers (e.g., AdminLayout)
├── navigation/        # Navbars, sidebars, drop-downs
├── ui/                # Fundamental UI blocks (Button, Input, Divider)
└── utility-panel/     # Global sliding panels
```

## How to Extend

When creating a component that is used across multiple features (e.g., a standardized Card or Modal), place it in `components/ui/`. If the component is highly specific to a single page (e.g., an Entry Gate chart), it belongs in the `features/` directory instead.
