# external imports
from fastapi import APIRouter, Request, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import glob
import json
from pydantic import BaseModel
from typing import List


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
        
class PinCheckData(BaseModel):
    company_id: str
    customer_id: str
    pin: str
    
    
class UserList(BaseModel):
    data: list[str]


@router.get("/", response_class=HTMLResponse)
async def read_pin_check(request: Request):          
    return templates.TemplateResponse(
        request=request, 
        name="pin-check.html",
        context={
            "translations": translations,
            "default_language": default_language,
        },
    )
    
    
@router.post("/check")
async def check_customer_data(pin_check_data: PinCheckData) -> list[str]:  
    if pin_check_data.company_id != "002":
        raise HTTPException(status_code=404, detail="Incorrect Company ID")
    
    if pin_check_data.customer_id != "123456":
        raise HTTPException(status_code=404, detail="Incorrect CustomerID")
    
    users = ["example@email.com", "test@test.com", "user@user.com"] if pin_check_data.pin == "123456" else []
    
    return users
