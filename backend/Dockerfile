FROM node:22-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
# If you transpile (TS): RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
