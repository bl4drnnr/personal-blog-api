FROM node:18.3.0 as development

WORKDIR /usr/src/personal-blog-api

RUN npm i -g nest

COPY package*.json ./

RUN npm install --force

COPY . .

ENV NODE_ENV=development

RUN npm run build
