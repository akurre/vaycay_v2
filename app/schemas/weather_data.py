from pydantic import BaseModel, HttpUrl


class WeatherDataBase(BaseModel):
    city: str
    country: str
    date: str
    lat: float
    long: float
    PRCP: float
    TAVG: float
    TMAX: float
    TMIN: float
    population: float
    name: str

# # Properties shared by models stored in DB
# class RecipeInDBBase(RecipeBase):
#     id: int
#     submitter_id: int

#     class Config:
#         orm_mode = True


# # Properties to return to client
# class Recipe(RecipeInDBBase):
#     pass


# # Properties properties stored in DB
# class RecipeInDB(RecipeInDBBase):
#     pass