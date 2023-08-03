FROM python:3-alpine3.15

WORKDIR /var/www/html/back-end

COPY . /var/www/html/back-end

RUN pip install -r requirements.txt

EXPOSE 8000

CMD python ./app.py