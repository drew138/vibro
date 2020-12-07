FROM python:3.8-alpine

ENV PYTHONBUFFERED=1

RUN apk add --update --no-cache --virtual .tmp gcc libc-dev linux-headers

RUN mkdir /api

WORKDIR /api/

COPY . /api/

RUN pip install -r /api/requirements.txt

RUN apk del .tmp

EXPOSE 8000