from pydantic import BaseModel

class RequestWeatherData(BaseModel):      # add BaseModel, otherwise request: Date below will throw errors bc it wants a pydantic model
    id = str
    name = str
    lat = str
    long = str
    date = str
    PRCP = str
    SNOW = str
    TMAX = float
    TMIN = float
    TAVG = float

    class Config:
        orm_mode = True