# external imports
from fastapi import APIRouter
from fastapi import Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import glob
import json

# internal imports
from utils import plural_formatting


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


default_fallback = "en"
languages = {}

language_list = glob.glob("app/translations/*.json")

for lang in language_list:
    filename = lang.split("/")
    lang_code = filename[2].split(".")[0]

    with open(lang, "r", encoding="utf8") as file:
        languages[lang_code] = json.load(file)

updated_plural_formatting = lambda key_value, input, locale: plural_formatting(languages, key_value, input, locale)

# assign filter to Jinja2
templates.env.filters['plural_formatting'] = updated_plural_formatting


@router.get("/{locale}", response_class=HTMLResponse)
async def read_translations(request: Request, locale: str):
    if(locale not in languages):
        locale = default_fallback
        
    result = {}
    result.update(languages[locale])
    result.update({"locale": locale, "bedroom_value": 2})
    
    return templates.TemplateResponse(request=request, name="translations.html", context=result)
