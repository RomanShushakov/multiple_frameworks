# external imports
from fastapi import APIRouter
from fastapi import Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import glob
import json


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

default_language = "en"
translations = {}
language_list = glob.glob("app/translations/pin_check/*.json")

for lang in language_list:
    filename = lang.split("/")
    lang_code = filename[3].split(".")[0]

    with open(lang, "r", encoding="utf8") as file:
        translations[lang_code] = json.load(file)


@router.get("/", response_class=HTMLResponse)
async def read_pin_check(request: Request):          
    return templates.TemplateResponse(
        request=request, name="pin-check.html", context={"translations": translations},
    )
