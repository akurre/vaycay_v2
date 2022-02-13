from datetime import date
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, Request, APIRouter
from typing import Optional
from database import get_db
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session      # type definition
from sqlalchemy.sql import func
from models import WeatherData_model
from schema import RequestWeatherData
import pandas as pd
import json
# uvicorn main:app --port 8080 --reload

load_dotenv(".env")

app = FastAPI() 
templates = Jinja2Templates(directory="templates")

"""GET"""
@app.get('/')   
async def root(request: Request):
    return templates.TemplateResponse('item.html', {'request': request})


@app.get('/dates')   
def all_dates(request: Request):
    dates = pd.date_range(start="2000-01-01",end="2000-12-31")
    dates_available = {}
    for date in dates:
        dates_available[date.strftime("%m%d")] = date.strftime("%B %d")
    return templates.TemplateResponse("dates.html", {'request': request, 'dates_available': dates_available})

    
@app.get('/date/{date_selected}')     # 0101 = January 1 (MMDD)
def show(request: Request,
               date_selected: str,  
               db: Session = Depends(get_db), 
               tmin_req: Optional[int] = 10,
               population_req: Optional[int] = 1000000):
    result = db.query(WeatherData_model).filter(WeatherData_model.date == date_selected,
                                                    WeatherData_model.population >= population_req,
                                                    WeatherData_model.tmin >= tmin_req).limit(50).all()     
    return templates.TemplateResponse("date_selected.html", context={'request': request, 
                                                                     'date_selected': date_selected, 
                                                                     'result': result})


"""POST"""
# # POST template
# @app.post("/add-book/", response_model=SchemaBook)
# def add_book(book: SchemaBook):
#     db_book = ModelBook(title=book.title, rating=book.rating, author_id=book.author_id)
#     db.session.add(db_book)
#     db.session.commit()
#     return db_book

# @app.post("/user/", response_model=SchemaUser)
# def create_user(user: SchemaUser):
#     db_user = ModelUser(
#         first_name=user.first_name, last_name=user.last_name, age=user.age
#     )
#     db.session.add(db_user)
#     db.session.commit()
#     return db_user


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
