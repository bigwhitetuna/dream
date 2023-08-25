import httpx
from .getUserInfo import getUserInfo
import logging

async def storeFavorite(interaction, dream_id):
    try:
        data = {
            "user_id": interaction.user.id,
            "mention": f'<@{interaction.user.id}>',
            "avatar": interaction.user.display_avatar.url,
            "dream_id": dream_id
        }

        async with httpx.AsyncClient() as client:
            response = await client.post("http://api:8000/api/favorite", json=data)

            if response.status_code != 200:
                print(f"Error: {response.status_code}")
                return

    except Exception as e:
        logging.error(e)