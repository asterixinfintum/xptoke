FROM node:18
WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .
ENV PORT 8001
ENV LIS ''
EXPOSE $PORT
CMD [ "node", "dist/index.js" ]