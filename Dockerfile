FROM node:latest

WORKDIR /usr/src/personal-blog-api

RUN npm i -g nest
RUN npm i -g @nestjs/cli

COPY package*.json ./

RUN npm install --force

COPY . .

ENV NODE_ENV=development

RUN npm run build
