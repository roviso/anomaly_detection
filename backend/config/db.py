from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from typing import AsyncIterator
from config.settings import projectSettings

# Asynchronous database URL
SQLALCHEMY_DATABASE_URL = projectSettings.DATABASE_URL

# Asynchronous engine
engine = create_async_engine(SQLALCHEMY_DATABASE_URL, future=True, echo=True, pool_size=20, max_overflow=10)

# Synchronous engine for operations that require it
db_engine = create_engine(projectSettings.SYNC_DB_URL)

# Asynchronous session factory
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

# Base class for declarative models
Base = declarative_base()

# Session getter function for dependency injection
async def get_session():
    session = async_session()
    try:
        yield session
    finally:
        await session.close()

# DB getter for dependency injection
async def get_db() -> AsyncIterator[AsyncSession]:
    async with async_session() as session:
        yield session
