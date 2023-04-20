FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Install TypeScript compiler
RUN npm install -g typescript

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
