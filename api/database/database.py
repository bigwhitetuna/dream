### Package imports
import dotenv
import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import MetaData, create_engine
### Custom imports
from .base import Base
### Model imports
## These imports are required to ensure that SQLAlchemy is aware of these models
## when setting up or initializing the database.
from .models.user import User
from .models.dream import Dream
from .models.favorite import Favorite

# load environment variables
### TODO: figure out why the commented out text isn't working
# dotenv.load_dotenv()
# DATABASE_URL = os.getenv("DATABASE_URL")
# SYNC_DATABASE_URL = os.getenv("SYNC_DATABASE_URL")
DATABASE_URL = "postgresql+asyncpg://postgres:mysecretpassword@db:5432/postgres"
SYNC_DATABASE_URL = "postgresql+psycopg2://postgres:mysecretpassword@db:5432/postgres"

# create engines
sync_engine = create_engine(SYNC_DATABASE_URL, echo=False)
async_engine = create_async_engine(DATABASE_URL, echo=False)

# create metadata
metadata = Base.metadata

# create async session
AsyncSessionLocal = sessionmaker(bind=async_engine, class_=AsyncSession, expire_on_commit=False)


async def setup_database():
    # reflect current state of the database
    async with async_engine.connect() as conn:
        await conn.run_sync(metadata.reflect)
    # create tables if they don't exist
    def create_tables_if_not_exist(sync_conn):
        metadata.create_all(bind=sync_engine, checkfirst=True)

    async with async_engine.begin() as conn:
        await conn.run_sync(create_tables_if_not_exist)
    # Table references
    print('\nDatabase setup complete\n')

async def get_db():
    db = AsyncSessionLocal()
    try:
        yield db
    finally:
        await db.close()

if __name__ == "__main__":
    asyncio.run(setup_database())
