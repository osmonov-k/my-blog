FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Use npm install instead of ci for development
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]