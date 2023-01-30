from datetime import datetime
from app.database.base import get_db
import uvicorn
from fastapi import FastAPI, Depends
from typing import Optional
from sqlalchemy.orm import Session      # type definition
from app.models.weather_data import weather_data_model
# uvicorn main:app --port 8080 --reload

# load_dotenv(".env")

app = FastAPI()

"""GET"""
class MasterClass:
    
    @app.get('/date/{date_selected}')     
    def get_by_date(date_input): # -> Optional[json]:
        db_session = Depends(get_db)
        data_from_date = (
            db_session.query(weather_data_model)
            .filter(weather_data_model.date == date_input)
            .all()
        )
        return data_from_date if date_input else None

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
