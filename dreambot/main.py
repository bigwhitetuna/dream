import asyncio
### Code imports
from dreambot.config import discordToken
from dreambot.discordCommands import bot

async def main():
    await bot.start(discordToken)

asyncio.get_event_loop().run_until_complete(main())