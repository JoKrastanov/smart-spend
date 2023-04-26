FROM node:14-alpine

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run

EXPOSE 8080

CMD ["npm", "run" ,"start"]
