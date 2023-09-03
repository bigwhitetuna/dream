import asyncio
### Code imports
from dreambot.config import discordToken
from dreambot.discordCommands import bot

async def main():
    await bot.start(discordToken)

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())