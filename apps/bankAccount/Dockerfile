FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
RUN npm i -g typescript
COPY . .
RUN npm run build
EXPOSE 6001
CMD ["npm", "start"]
