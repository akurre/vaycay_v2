from datetime import datetime
from database import get_db
import uvicorn
from fastapi import FastAPI, Depends
from typing import Optional
from sqlalchemy.orm import Session      # type definition
from models import weather_data_model
# uvicorn main:app --port 8080 --reload

# load_dotenv(".env")

app = FastAPI()

"""GET"""
# class AmetrasVehicleRepository:
#     def __init__(
#         self,
#         db_session: Session = Depends(get_ametras_db_session),
#     ) -> None:
#         self.db_session = db_session

#     def get_vehicle_by_vin(self, vin: str) -> Optional[AmetrasVehicle]:
#         vehicle = (
#             self.db_session.query(AmetrasVehicleModel)
#             .filter(DatabaseAmetrasCar.chassisno == vin)
#             .first()
#         )
#         return AmetrasVehicleModel.to_entity(vehicle) if vehicle else None

# class MasterClass:
#     def __init__(
#     self,
#     db_session: Session = Depends(get_db),
#     ) -> None:
#         self.db_session = db_session

#     def get_by_date(self, date_input: datetime): # -> Optional[json]:
#         data_from_date = (
#             self.db_session.query(weather_data_model)
#             .filter(weather_data_model.date == date_input)
#             .all()
#         )
#         return data_from_date if date_input else None

@app.get('/')   
async def root():
    return {'result': 'welcome'}

@app.get('/date/{date_selected}')     # 0101 = January 1 (MMDD)
def get_by_date(self, date_input: datetime): # -> Optional[json]:
    data_from_date = (
        self.db_session.query(weather_data_model)
        .filter(weather_data_model.date == date_input)
        .all()
    )
    return data_from_date if date_input else None

    
# async def show(date_selected: str,  
#                db: Session = Depends(get_db), 
#                tmin_req: Optional[int] = None,
#                population_req: Optional[int] = 100000):
#     result = []
#     try:
#         result = db.query(weather_data_model).filter(weather_data_model.date == date_selected,
#                                                     weather_data_model.population >= population_req,
#                                                     weather_data_model.TMIN >= tmin_req).limit(50).all()
#     except Exception as e:
#         print('!!~')
#         print(e)
#     return result


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
