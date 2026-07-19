# PERIMO API Guide

## Overview
The API is built using FastAPI and follows a RESTful design with WebSocket support for real-time updates.

## Key Endpoints
- POST /v1/auth/login: Authenticate users.
- GET /v1/transport/overview: Retrieve transportation status.
- GET /v1/live-ops/overview: Retrieve live operational metrics.
- WS /v1/ws: WebSocket endpoint for real-time updates.

## Authentication
All secure endpoints require a Bearer token in the Authorization header.