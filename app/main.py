from fastapi import FastAPI, APIRouter, Query, HTTPException, Request, Depends
from datetime import date

from app.crud import *
from typing import Optional, Any
from pathlib import Path
from sqlalchemy.orm import Session

from app.schemas.weather_data import WeatherDataBase
from app import deps
from app import crud


# Project Directories
ROOT = Path(__file__).resolve().parent.parent
BASE_PATH = Path(__file__).resolve().parent


app = FastAPI(title="Recipe API", openapi_url="/openapi.json")

api_router = APIRouter()


@api_router.get("/", status_code=200)
def root(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> dict:
    """
    Root GET
    """
    returned_data = crud.weather_data.get_multi(db=db, limit=10)
    return {"request": request, "data": returned_data}


@api_router.get("/day/{date_selected}", status_code=200, response_model=WeatherDataBase)
def fetch_date(
    *,
    date_selected: date,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Fetch a single date by ID
    """
    result = crud.weather_data.get(db=db, date=date_selected)
    if not result:
        # the exception is raised, not returned - you will get a validation
        # error otherwise.
        raise HTTPException(
            status_code=404, detail=f"Weather data for date {date_selected} not found"
        )

    return result


app.include_router(api_router)


if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="debug")





'''
from datetime import datetime
from app.database.base import get_db
import uvicorn
from fastapi import FastAPI, Depends
from typing import Optional
from sqlalchemy.orm import Session      # type definition
from app.models.weather_data import WeatherDataModel
# uvicorn main:app --port 8080 --reload

# load_dotenv(".env")

app = FastAPI()

"""GET"""
class MasterClass:
    
    @app.get('/date/{date_selected}')     
    def get_by_date(date_input): # -> Optional[json]:
        db_session = Depends(get_db)
        data_from_date = (
            db_session.query(WeatherDataModel)
            .filter(WeatherDataModel.date == date_input)
            .all()
        )
        return data_from_date if date_input else None

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''

