FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ARG PORT
ARG KEY

ENV PORT=${PORT}
ENV KEY=${KEY}

EXPOSE ${PORT}

CMD ["npm", "run", "start"]
