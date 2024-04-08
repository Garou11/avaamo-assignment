FROM postgres:13-alpine
ENV POSTGRES_USER=aditya \
    POSTGRES_PASSWORD=De@ctivate30 \
    POSTGRES_DB=avaamo

COPY init.sql /docker-entrypoint-initdb.d/

CMD ["postgres"]

EXPOSE 5432

FROM node:16-alpine

WORKDIR /app

COPY . .
RUN npm install --silent

CMD ["npm", "start"]

EXPOSE 4000
EXPOSE 3000
