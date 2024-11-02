# external dependencies
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware

# internal dependencies
from core.config import settings
from api.main import api_router


app = FastAPI(
    title=settings.PROJECT_NAME,
)

if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)
app.mount("/app/static", StaticFiles(directory="app/static"), name="static")


@app.get("/greeting")
async def read_root():
    return {"Hello": "World"}
