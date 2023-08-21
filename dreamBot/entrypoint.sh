#!/bin/bash

# Add current directory to Python path
export PYTHONPATH="${PYTHONPATH}:/app"

# Start the FastAPI application in the foreground
hupper -m python3 -u dreamBot.main