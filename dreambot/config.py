### collection configurations
import os
from dotenv import load_dotenv

#######################################
# Set environment variables
#######################################
load_dotenv()
discordToken = os.getenv("DISCORD_BOT_TOKEN")
# Stability variables
engineId = "stable-diffusion-xl-1024-v1-0"
baseUrl = 'https://api.stability.ai'
apiKey = os.getenv('STABILITY_API_KEY')