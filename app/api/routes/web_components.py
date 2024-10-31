# external imports
from fastapi import APIRouter
from fastapi import Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


@router.get("/{time_zone}", response_class=HTMLResponse)
async def read_web_components(request: Request, time_zone: str):
    converted_timezone = "Europe/Berlin"
    
    print(time_zone)
    
    if time_zone == "aus":
        converted_timezone = "Australia/Sydney"
    
    return templates.TemplateResponse(
        request=request, name="web-components.html", context={"time_zone": converted_timezone},
    )
