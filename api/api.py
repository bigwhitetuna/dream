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
from fastapi.responses import JSONResponse
from fastapi_discord import DiscordOAuthClient, RateLimited, Unauthorized, User
from fastapi_discord.models import GuildPreview
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.requests import Request
from starlette.responses import RedirectResponse
import discord
import os
import dotenv
import logging
logging.basicConfig(level=logging.DEBUG)

### Custom imports
from .database.database import AsyncSessionLocal, User, Dream, Favorite, get_db
app = FastAPI()

### TODO: Switch this to a new key, and store it as an environment variable
SESSION_SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # allows all methods
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=SESSION_SECRET_KEY)

### DISCORD AUTH ###
dotenv.load_dotenv()
### Identify env variables
DISCORD_CLIENT = os.getenv('DISCORD_CLIENT')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
DISCORD_REDIRECT_URI = os.getenv('DISCORD_REDIRECT_URI')
DISCORD_TOKEN_URL = "https://discord.com/api/v10/oauth2/token"

discord = DiscordOAuthClient(
    DISCORD_CLIENT, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, ("identify", "guilds")
)
###TODO: NEED TO FINSIH FIXING THIS
###TODO: DONT FORGET
###TODO: DONT FORGET
###TODO: I am getting the token, but it the /auth/callback seems to be running twice, and it's invalidating my token the second run through fore everything can finish.
###TODO: Need to figure out how to stop the second run through, or figure out why it's invalidating the token.
@app.get("/auth/callback")
async def callback(code: str, request: Request):
    import httpx
    async def exchange_code(code):
        payload = {
            "client_id": DISCORD_CLIENT,
            "client_secret": DISCORD_CLIENT_SECRET,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": DISCORD_REDIRECT_URI,
            "scope": "identify guilds"
        }
        headers: dict = {"Content-Type": "application/x-www-form-urlencoded"}

        logging.info(f"Payload: {payload}")
        async with httpx.AsyncClient() as client:
            resp = await client.post(DISCORD_TOKEN_URL, data=payload, headers=headers)
        logging.info(f"Response: {resp.json()}")
        return resp.json()
                

    tokenData = await exchange_code(code)
    logging.info(f"Token data: {tokenData}")

    token = tokenData['access_token']
    logging.info(f"Token: {token}")

    guilds = await discord.guilds(token)
    logging.info(f"Guilds: {guilds}")

    specific_guild_id = '209441515041325056'
    user = await discord.get_user(token['user_id'])
    logging.info(f"User: {user}")

    if any(guild.id == specific_guild_id for guild in guilds):
        request.session["user_id"] = token['user_id']
        return JSONResponse(status_code=200, content={"route": "/", "message": "authorized","userData": user})
    else:
       return JSONResponse(status_code=401, content={"status": "error", "message": "unauthorized", "route": "/login", "details": "Not a member of the guild"})

### Just to validate if the user has a session cookie
@app.get("/validatesession")
async def validate_session(current_user: int = None):
    if current_user is None:
        return JSONResponse(status_code=200, content={"valid": False, "message": "unauthorized"})
    else:
        return JSONResponse(status_code=200, content={"valid": True, "message": "authorized"})
    

@app.get("/auth/login")
async def login():
    return {"url": discord.oauth_login_url}

@app.exception_handler(Unauthorized)
async def unauthorized_error_handler(_, __):
    return JSONResponse(status_code=401, content={"message": "Unauthorized"})

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
        # start a transaction
        async with db.begin():
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
        return {"message": "Dream stored successfully!", "dream_id": new_dream.id}
            
    except Exception as e:
        await db.rollback()
        # Log the exception (assuming you have a logger setup)
        logging.error("Couldn't store dream: %s", e)
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

class CreateFavorite(BaseModel):
    user_id: int
    mention: str
    avatar: str
    dream_id: int

@app.post("/api/favorite")
async def create_favorite(favorite: CreateFavorite, db: AsyncSession = Depends(get_db)):
    try:
        # start a transaction
        async with db.begin():
            # Create a select object to check if the user exists in users table already
            stmt = select(User).where(User.discord_user_id == favorite.user_id)
            result = await db.execute(stmt)
            db_user = result.scalar_one_or_none()
            
            # if user isn't in users table, insert user info to users table
            if db_user is None:
                new_user = User(
                    discord_user_id=favorite.user_id,
                    discord_nickname=favorite.mention,
                    discord_avatar=favorite.avatar
                )
                db.add(new_user)
                # This will "flush" the operation, allowing the ID to be generated without committing the transaction.
                await db.flush()
                user_id_for_favorite = new_user.id
            else:
                user_id_for_favorite = db_user.id

            new_favorite = Favorite(
                user_id=user_id_for_favorite,
                dream_id=favorite.dream_id
            )
            db.add(new_favorite)
            await db.commit()
        return {"message": "Favorite saved successfully!"}

    except Exception as e:
        await db.rollback()
        logging.error(e)

# @app.on_event("startup")
# async def on_startup():
#     await discord.init()
### Check to see if user is authenticated
def get_current_user(request: Request):
    user_id = request.session.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_id
# TODO: Import ain't workin' for ClientSessionNotInitialized, will fix later.
# @app.exception_handler(ClientSessionNotInitialized, RateLimited)
# async def client_session_error_handler(_, __):
#     return JSONResponse(status_code=500, content={"message": "Internal server error"})

# @app.get(
#     "/authenticated",
#     dependencies=[Depends(discord.requires_authorization)],
#     response_model=bool
#     )
# async def isAuthenticated(token: str = Depends(discord.get_token)):
#     try:
#         auth = await discord.isAuthenticated(token)
#         return auth
#     except Unauthorized:
#         return False

# @app.get("/user", dependencies=[Depends(discord.requires_authorization)], response_model=User)
# async def get_user(user: User = Depends(discord.get_current_user)):
#     return user

# @app.get("/guilds", dependencies=[Depends(discord.requires_authorization)], response_model=List[GuildPreview])
# async def get_guilds(guilds: List = Depends(discord.guilds)):
#     return guilds

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)