### Package imports
from sqlalchemy import select
import httpx
import logging
logging.basicConfig(level=logging.DEBUG)
### update the database with each request
async def store_request(user, prompt, style, content_url, model, negativePrompt=None, imagination=None, quality=None, revised_prompt=None):
    try:
        data = {
            'user_id': user['id'],
            'user_name': user['name'],
            'user_avatar': user['avatar'],
            'prompt': prompt,
            'negative_prompt': negativePrompt,
            'imagination': imagination,
            'style': style,
            'image_url': content_url,
            'model': model,
            'quality': quality,
            'revised_prompt': revised_prompt
        }

        async with httpx.AsyncClient() as client:
            response = await client.post("http://api:8000/api/dream", json=data)

            if response.status_code != 200:
                logging.error(f"Error: {response.status_code} - {response.text}")
                return
            return response.json().get('dream_id')
    except Exception as e:
        logging.error(f"Error storing request: {e}")