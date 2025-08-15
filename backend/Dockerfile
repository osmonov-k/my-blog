FROM node:22-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
# If you have a build step, keep it; otherwise this is fine:
RUN npm run build || true
ENV NODE_ENV=production
EXPOSE 3000
# Change the entry if your app starts differently:
CMD ["node", "index.js"]
