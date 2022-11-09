#Eduardo Candella

from typing import Union
from fastapi import FastAPI
import requests
from pedantic import pedantic
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/get_weather_by_zip/{zip}")
def get_weather_by_zip(zip: int, q: Union[str, None] = None):
    URL = "http://api.openweathermap.org/data/2.5/weather"
    
    zipcode = str(zip)+",us"
    PARAMS = {'zip': zipcode,
            'appid': '655dfc390726be35679ee1f171b45301'}
    r = requests.get(url = URL, params = PARAMS)
    data = r.json()
    
    return data

if __name__ == "__main__":
    uvicorn.run("app:app")
