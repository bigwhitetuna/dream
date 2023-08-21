import asyncio
### Code imports
from dreamBot.config import discordToken
from dreamBot.discordCommands import bot

async def main():
    await bot.start(discordToken)

asyncio.get_event_loop().run_until_complete(main())