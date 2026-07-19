# PERIMO Deployment Guide

## Prerequisites
- Node.js >= 18
- Python >= 3.11

## Frontend Deployment (Vercel)
1. Link the repository to Vercel.
2. Build command: 
pm run build`n3. Output directory: dist`n4. Environment variables: configure VITE_API_URL.

## Backend Deployment
1. Install dependencies: pip install -r requirements.txt`n2. Set environment variables (e.g., JWT_SECRET, CORS_ORIGINS).
3. Run server: uvicorn src.main:app --host 0.0.0.0 --port 8000.