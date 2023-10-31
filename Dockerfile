FROM node:20.9.0-slim
WORKDIR /app
COPY package*.json ./

COPY routes ./routes
COPY main.js .

RUN npm install

EXPOSE 80

CMD [ "node", "main.js" ]

