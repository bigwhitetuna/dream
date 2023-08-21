#!/bin/bash

# Run DB setup to make sure everything is gucci
python3 -m api.database.database
# Start the FastAPI application in the foreground
uvicorn api.api:app --host 0.0.0.0 --port 8000 --reload