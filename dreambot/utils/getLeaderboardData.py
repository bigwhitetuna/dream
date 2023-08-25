### Package imports
import httpx
from typing import List

### Custom imports

async def get_leaderboard_data() -> List[dict]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://api:8000/api/leaderboard")

            if response.status_code != 200:
                print(e)
                return []

            return response.json()
        
    except Exception as e:
        print(e)