FROM node:16-alpine

WORKDIR /app

COPY . .
RUN npm install --silent

CMD ["npm", "start"]

EXPOSE 4000
EXPOSE 3000