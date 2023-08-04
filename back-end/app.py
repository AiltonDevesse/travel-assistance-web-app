import os
import logging
import requests
import json
import pprint as pp
import psycopg2
from countryinfo import CountryInfo
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

CREATE_USERS_TABLE = (
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, nome TEXT, apelido TEXT, email TEXT, password TEXT);"
)

INSERT_USER = (
    "INSERT INTO users (nome, apelido, email, password) values(%s,%s,%s,%s);"
)

SELECT_USER = (
    "SELECT * FROM users WHERE email = %s;"
)

AUTHENTICATE = (
    "SELECT * FROM users WHERE email = %s AND password = %s;"
)

load_dotenv()

app = Flask(__name__)
CORS(app,resources={
    r"/*":{
        "origin": "*"
    }
})

forecast_key= os.getenv("FORECAST_KEY")
forecast_api= os.getenv("FORECAST_API")
exchange_rate_key= os.getenv("EXCHANGERATE_KEY")
exchange_rate_api= os.getenv("EXCHANGERATE_API")
gdp_api= os.getenv("GDP_API")
connection = psycopg2.connect(
    database="travel_mpesa", 
    user="ailton",
    password="pass123",
    host="postgres",
    port="5432"
)

app.logger.setLevel(logging.DEBUG)
stream_handler = logging.StreamHandler()
app.logger.addHandler(stream_handler)

@app.route('/api/authenticate', methods=['POST'])
def authenticate():
    data = request.get_json()
    email = data['email']
    password = data['password']
    with connection: 
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(AUTHENTICATE,(email,password,))
            user = cursor.fetchone()
            if user:
                return jsonify({"message":"Authenticated with Success"}), 200
    return jsonify({"message":"E-mail or Password incorrect"}), 401


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    nome = data['nome']
    apelido = data['apelido']
    email = data['email']
    password = data['password']
    with connection: 
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(SELECT_USER,(email,))
            user = cursor.fetchone()
            if user:
                return jsonify({"message":"Account already exists"}), 403
            cursor.execute(INSERT_USER, (nome, apelido, email, password,))
    return jsonify({"message":"Registration Complete"}), 200


@app.route('/api/calls', methods=['GET','POST'])
def calls():
    data = request.get_json()
    search = data['search']

    lt_lg = (forecast_api
        + 'geo/1.0/direct'
        + '?q={}'
        + '&limit={}'
        + '&appid={}'
        ).format(search,1,forecast_key)
    lt_lg_response = requests.get(lt_lg).json()
    lat = lt_lg_response[0]["lat"]
    lon = lt_lg_response[0]["lon"]
    country = lt_lg_response[0]["country"]
    currency_code = CountryInfo(country).currencies()[0]
    
    fc = (forecast_api
        + 'data/2.5/weather'
        + '?lat={}'
        + '&lon={}'
        + '&appid={}'
        ).format(lat,lon,forecast_key)
    fc_response = requests.get(fc).json()
    forecast = 'Weather ' + fc_response["weather"][0]["main"] + ' Min: ' + str(fc_response["main"]["temp_min"])+ ' Max: ' + str(fc_response["main"]["temp_max"])

    ex = (exchange_rate_api
        + 'latest'
        + '?access_key={}'
        + '&base={}'
        ).format(exchange_rate_key, currency_code)
    ex_response = requests.get(ex).json()
    exchangerate = ex_response["rates"]
    
    pop = (gdp_api
        + '{}/'
        + 'indicator/SP.POP.TOTL?format=json&date=2022' #2022 porque nao tem nenhuma actualizacao de 2023
        ).format(country)
    pop_response = requests.get(pop).json()
    population = pop_response[1][0]["value"]
    
    g = (gdp_api
    + '{}/'
    + 'indicator/NY.GDP.PCAP.CD?format=json&date=2022' #2022 porque nao tem nenhuma actualizacao de 2023
    ).format(country)
    gdp_response = requests.get(g).json()
    gdp = gdp_response[1][0]["value"]
    
    return jsonify({"forecast":forecast,"exchangerate": exchangerate, "population": population, "gdp":gdp}), 200
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)