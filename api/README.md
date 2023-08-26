# Overview
This API service acts as the connector between the discord bot, the database, and the website.

Built on FastAPI.

## Setup
In order for this API to function properly, you need to define these variables in `dream/api/.env`:
- `DISCORD_CLIENT` - The client ID of the Discord bot
- `DISCORD_CLIENT_SECRET` - The client secret of the Discord bot
- `DISCORD_REDIRECT_URI` - The redirect URI for the Discord OAuth2 flow (should be `http://localhost:5000/auth/callback` for local development)

## API Endpoints
#### Bot
- `POST /api/dream` Stores the dream response from the bot
- `GET /api/leaderboard` Returns the top 10 users with the most dreams
- `POST /api/favorite` Stores a dream response to user's favorites
#### Web
- `GET /api/data` Returns a JSON of all the data for website to load (will be changed as website is optimized)
- `GET /auth/login` Returns redirect link for Discord OAuth2 flow
- `GET /auth/callback` Callback for Discord OAuth2 flow
- `GET /validatesession` Validates the user's session