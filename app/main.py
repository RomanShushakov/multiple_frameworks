# external dependencies
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

# internal dependencies
from core.config import settings
from api.main import api_router


app = FastAPI(
    title=settings.PROJECT_NAME,
)
app.include_router(api_router, prefix=settings.API_V1_STR)
app.mount("/app/static", StaticFiles(directory="app/static"), name="static")


@app.get("/")
async def read_root():
    return {"Hello": "World"}
