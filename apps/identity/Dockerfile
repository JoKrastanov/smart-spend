FROM node:14-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g typescript
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]