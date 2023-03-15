FROM node:7.7.2-alpine
WORKDIR /dist/app.js
COPY package.json .
RUN npm install --quiet
COPY . .