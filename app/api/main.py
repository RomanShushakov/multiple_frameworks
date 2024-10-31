# external imports
from fastapi import APIRouter

# internal imports
from api.routes import items, web_components, translations, pin_check


api_router = APIRouter()
api_router.include_router(items.router, prefix="/items", tags=["items"])
api_router.include_router(web_components.router, prefix="/web-components", tags=["web-components"])
api_router.include_router(translations.router, prefix="/translations", tags=["translations"])
api_router.include_router(pin_check.router, prefix="/pin-check", tags=["pin-check"])
