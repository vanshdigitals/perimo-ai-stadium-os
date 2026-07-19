# PERIMO Backend Guide

## Overview
The backend manages business logic, data persistence, and real-time events.

## Environment Variables
- JWT_SECRET: Must be exactly 32 bytes or longer in production.
- FIRESTORE_PROJECT_ID: Set for GCP deployments.

## Testing
Run tests using python -m pytest. Ensure all tests pass before deploying.