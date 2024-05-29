FROM postgres:latest

ENV POSTGRES_PASSWORD=root
ENV POSTGRES_USER=root
ENV POSTGRES_HOST_AUTH_METHOD=trust
ENV POSTGRES_DB=chatapp

COPY ./chatapp.sql /chatapp.sql
COPY ./init-db.sh /docker-entrypoint-initdb.d/init-db.sh

EXPOSE 5432