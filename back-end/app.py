import os
import requests
import json
import pprint as pp
import psycopg2
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv

CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, nome TEXT, apelido TEXT, email TEXT, password TEXT);"
)

INSERT_USER = (
    "INSERT INTO users (nome, apelido, email, password) values(%s,%s,%s,%s);"
)

load_dotenv()

app = Flask(__name__)
forecast_key= os.getenv("FORECAST_KEY")
forecast_api= os.getenv("FORECAST_API")
exchange_rate_key= os.getenv("EXCHANGERATE_KEY")
exchange_rate_api= os.getenv("EXCHANGERATE_API")
gdp_key= os.getenv("GDP_KEY")
gdp_api= os.getenv("GDP_API")
bd_url= os.getenv("DATABASE_URL")
connection = psycopg2.connect(
    database="travel_mpesa", 
    user="ailton",
    password="pass123",
    host="127.0.0.1"
)

CORS(app)

cors = CORS(app,resources={
    r"/":{
        "origin": "*"
    }
})


@app.route('/api/register', methods=['GET','POST'])
def create_user():
    data = request.get_json()
    nome = data['nome']
    apelido = data['apelido']
    email = data['email']
    password = data['password']
    with connection: 
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(INSERT_USER, (nome, apelido, email, password))
    return {"message":"Registration Complete"}, 200


@app.route('/api/calls', methods=['GET','POST'])
def my_index():
    data = request.get_json()
    search = data['search']

    lt_lg = (forecast_api
        + 'geo/1.0/direct'
        + '?q={}'
        + '&limit={}'
        + '&appid={}'
        ).format(search,5,forecast_key)

    print(lt_lg)
    lt_lg_response = requests.get(lt_lg).json()
    print(lt_lg_response)

    lat = ''
    lon = ''

    fc = (forecast_api
        + 'data/2.5/weather'
        + '?lat={}'
        + '&lon={}'
        + '&appid={}'
        ).format(lat,lon,forecast_key)
    fc_response = requests.get(fc).json()
    print(fc_response)

    ##get currency code based on city name / lt lg

    ex = (exchange_rate_api
        + 'latest'
        + '?access_key={}'
        + '&base={}'
        ).format(exchange_rate_key, currency_code)
    ex_response = requests.get(ex).json()
    print(ex_response)

    gdp = (gdp_api
        + '&key={}'
        ).format(gdp_key)
    gdp_response = requests.get(gdp).json()
    print(gdp_response)

if __name__ == '__main__':
    app.run(debug=True)