#!/bin/bash

# debuffer prints for development
export PYTHONUNBUFFERED=1

# Add current directory to Python path
export PYTHONPATH="${PYTHONPATH}:/app"

# Start the FastAPI application in the foreground
hupper -m dreamBot.main