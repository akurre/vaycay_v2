import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from typing import Optional
from database import get_db
from sqlalchemy.orm import Session      # type definition
from models import WeatherData_model
from schema import RequestWeatherData
# uvicorn main:app --port 8080 --reload

load_dotenv(".env")

app = FastAPI()


"""GET"""
@app.get('/')   
async def root():
    return {'result': 'welcome'}

@app.get('/date/{date_selected}')     # 0101 = January 1 (MMDD)
async def show(date_selected: str,  
               db: Session = Depends(get_db), 
               tmin_req: Optional[int] = None,
               population_req: Optional[int] = 100000):
    try:
        result = db.query(WeatherData_model).filter(WeatherData_model.date == date_selected,
                                                    WeatherData_model.population >= population_req,
                                                    WeatherData_model.tmin >= tmin_req).limit(50).all()
    except Exception as e:
        print(e)
    return result



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
