from fastapi import FastAPI, APIRouter, Query, HTTPException, Request, Depends

from vaycay.crud import *
from typing import Optional, Any
from pathlib import Path
from sqlalchemy.orm import Session

from vaycay.schemas.weather_data import WeatherDataBase
from vaycay import deps
from vaycay import crud
from fastapi.middleware.cors import CORSMiddleware

# Project Directories
ROOT = Path(__file__).resolve().parent.parent
BASE_PATH = Path(__file__).resolve().parent


vaycay = FastAPI(title="Vaycay App", openapi_url="/openapi.json")

api_router = APIRouter()

vaycay.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@api_router.get("/", status_code=200)
async def root(
    request: Request
) -> dict:
    """
    Root GET
    """
    client_host = request.client
    return {"request": client_host, "return": "hello world!"}


@api_router.get("/get_all", status_code=200)
async def root(
    request: Request,
    db: Session = Depends(deps.get_db),
) -> dict:
    returned_data = crud.weather_data.get_all(db=db, limit=10)
    client_host = request.client
    return {"request": client_host, "data": returned_data}


@api_router.get("/day/{month_and_day}", status_code=200)
async def fetch_date(
    *,
    month_and_day: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Fetch a single date by ID
    """
    date_selected = '2020-' + month_and_day[:2] + '-' + month_and_day[2:]
    print('!!x!', month_and_day)
    result = crud.weather_data.get_data_with_selected_date(db=db, date_selected=date_selected)
    if not result:
        raise HTTPException(
            status_code=404, detail=f"Weather data for date {date_selected} not found"
        )
    return result

@api_router.get("/city/{city_selected}", status_code=200)
async def fetch_date(
    *,
    city_selected: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Fetch a single date by ID
    """
    # city_selected = '2020-' + month_and_day[:2] + '-' + month_and_day[2:]
    result = crud.weather_data.get_data_with_selected_city(db=db, city_selected=city_selected)
    if not result:
        raise HTTPException(
            status_code=404, detail=f"Weather data for city {city_selected} not found"
        )
    return result


vaycay.include_router(api_router)


if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run(vaycay, host="0.0.0.0", port=8001, log_level="debug")





'''
from datetime import datetime
from vaycay.db.base import get_db
import uvicorn
from fastapi import FastAPI, Depends
from typing import Optional
from sqlalchemy.orm import Session      # type definition
from vaycay.models.weather_data import WeatherDataModel
# uvicorn main:vaycay --port 8080 --reload

# load_dotenv(".env")

vaycay = FastAPI()

"""GET"""
class MasterClass:
    
    @vaycay.get('/date/{date_selected}')     
    def get_by_date(date_input): # -> Optional[json]:
        db_session = Depends(get_db)
        data_from_date = (
            db_session.query(WeatherDataModel)
            .filter(WeatherDataModel.date == date_input)
            .all()
        )
        return data_from_date if date_input else None

if __name__ == "__main__":
    uvicorn.run(vaycay, host="0.0.0.0", port=8000)
'''

