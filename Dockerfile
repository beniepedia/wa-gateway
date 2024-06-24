FROM node:16-alpine
WORKDIR /app

VOLUME /app/wa_credentials

COPY package*.json ./

RUN npm i

COPY . .

CMD ["npm", "run", "start"]
