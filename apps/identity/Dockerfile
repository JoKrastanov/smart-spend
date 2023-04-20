# Use an official Node.js runtime as a parent image
FROM node:14-alpine

# Set environment variables
ENV NODE_ENV=production
ENV JWT_SECRET=SIF%Gka982SKGI9S8gkagjed9FKAQ19T
ENV JWT_REFRESH_SECRET=39DKAPkd0d@adjtJGOD04GITdk23Fl3a
ENV JWT_EXPIRES_IN=20m
ENV JWT_REFRESH_EXPIRES_IN=1d

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript compiler
RUN npm install -g typescript

# Copy the rest of the application files to the container
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the port that the application will run on
EXPOSE 4000

# Start the application
CMD ["npm", "start"]