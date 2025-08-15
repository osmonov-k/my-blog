# my-blog/backend/Dockerfile
# Use Node 22 to satisfy packages that require >=22
FROM node:22-alpine

# Healthcheck uses curl
RUN apk add --no-cache curl

WORKDIR /app

# Install only prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Optional build step (ignore if not present)
RUN npm run build || true

ENV NODE_ENV=production
EXPOSE 3000

# Start the app. If your entry point isn't index.js, change this line.
CMD ["node", "index.js"]
