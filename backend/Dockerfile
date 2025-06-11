# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /app/data
RUN mkdir -p /app/data

EXPOSE 5000
CMD ["node","server.js"]