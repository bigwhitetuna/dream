# Overview
This Discord bot is the main component of the Dream project. It is responsible for generating images based on prompts, storing them, and sending them to the user.

## Local Setup
1. Create a Discord bot in the (Discord Developer Portal)[https://discord.com/developers/applications]
2. In the OAuth2 tab, add the following redirect URL: `http://localhost:5000/auth/callback`
3. In the Bot tab, copy the token and add it to `dreambot/.env` as `DISCORD_BOT_TOKEN`
4. Add your (Stability API)[https://platform.stability.ai/account/keys] key to `dreambot/.env` as `STABILITY_API_KEY`
5. In `/dreambot/discordCommands.py`, uncomment these commands 
    # uncomment if running for first time, will sync commands. 
    # do not run every time during development, only when NEW commands are added, not when commands are edited (those work with no sync). 
    # await bot.tree.sync()
    # logging.info('Synced commands')
6. Start the containers

## Discord Commands
1. `/dream` - Generates a dream based on the prompt provided
   1. Prompt (required): The prompt to generate the image from
   2. Negative Prompt (optional): Things to explicitly discourage in the image generation
   3. Imagination (optional): The amount of creativity the AI should use. Between 1-35, with 1 being the most creative and 35 being very strict to the prompt. If not provided, defaults to 10.
   4. Style Preset (optional): Select from pre-made styles provided by Stability AI for specific response styles.
2. `/dreamleader` - Returns the top 10 users with the most dreams
3. `/dreamsync` - Syncs the commands with Discord. Only needs to be run when new commands are added, not when existing commands are edited.
4. `/dreamhelp` - Returns a helpful response about the bot.