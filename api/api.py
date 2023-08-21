### Package imports
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
### Custom imports
from .database.database import AsyncSessionLocal, User, Dream, Favorite, get_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allows all origins, be careful in production!
    allow_credentials=True,
    allow_methods=["*"],  # allows all methods
    allow_headers=["*"],
)

### API models
# model used for storing dreams
class CreateDream(BaseModel):
    user_id: int
    prompt: str
    negative_prompt: str
    imagination: int
    style: Optional[str] = None
    image_url: str

# model used for getting leaderboard data
class LeaderboardEntry(BaseModel):
    discord_user_id: int
    dream_count: int

### post for storing image requests
@app.post("/api/dream")
async def create_dream(dream: CreateDream, db: AsyncSession = Depends(get_db)):
    try:
        # Create a select object to check if the user exists in users table already
        stmt = select(User).where(User.discord_user_id == dream.user_id)
        result = await db.execute(stmt)
        db_user = result.scalar_one_or_none()
        
        # if user isn't in users table, insert user info to users table
        if db_user is None:
            new_user = User(
                discord_user_id=dream.user_id,
                discord_nickname=dream.discord_nickname,
                discord_avatar=dream.discord_avatar
            )
            db.add(new_user)
            # This will "flush" the operation, allowing the ID to be generated without committing the transaction.
            await db.flush()
            user_id_for_dream = new_user.id
        else:
            user_id_for_dream = db_user.id
        
        # Inserting the dream
        new_dream = Dream(
            user_id=user_id_for_dream,
            prompt=dream.prompt,
            negative_prompt=dream.negative_prompt,
            imagination=dream.imagination,
            style=dream.style,
            image_url=dream.image_url
        )
        db.add(new_dream)

        await db.commit()
        return {"message": "Dream created successfully!"}
            
    except Exception as e:
        await db.rollback()
        # Log the exception (assuming you have a logger setup)
        print(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An error occurred while processing your request.")

### broad data get endpoint, for webapp to use
@app.get("/api/data")
async def get_data(db: AsyncSession = Depends(get_db)):
    stmt = select(User, Dream, Favorite).join(Dream, User.id == Dream.user_id).outerjoin(Favorite, User.id == Favorite.user_id)
    result = await db.execute(stmt)
    data = result.all()

    serialized_data = [
        {
            "user": {
                "id": user.id,
                "discord_user_id": user.discord_user_id,
                "discord_nickname": user.discord_nickname,
                "discord_avatar": user.discord_avatar
            },
            "dream": {
                "id": dream.id,
                "prompt": dream.prompt,
                "negative_prompt": dream.negative_prompt,
                "imagination": dream.imagination,
                "style": dream.style,
                "image_url": dream.image_url,
                "timestamp": dream.timestamp
            },
            "favorite": {
                "id": favorite.id if favorite else None,
                "created_at": favorite.created_at if favorite else None
            }
        }
        for user, dream, favorite in data
    ]

    return serialized_data

@app.get("/api/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard_data(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            select(
                User.discord_user_id,
                func.count(Dream.id).label('dream_count')
            )
            .select_from(User)
            .join(Dream, User.id == Dream.user_id)
            .group_by(User.discord_user_id)
            .order_by(func.count(Dream.id).desc())
            .limit(10)
        )
        data = result.all()
        return [{"discord_user_id": entry[0], "dream_count": entry[1]} for entry in data]

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to fetch leaderboard data.")


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
    print('API running!')