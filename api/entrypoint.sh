#!/bin/bash

# debuffer prints for development
export PYTHONUNBUFFERED=1

# Wait for the database to be ready
dockerize -wait tcp://db:5432 -timeout 30s

# Run DB setup to make sure everything is gucci
python3 -u -m api.database.database

# Start the FastAPI application in the foreground
uvicorn api.api:app --host 0.0.0.0 --port 8000 --reload