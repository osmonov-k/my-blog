# my-blog/backend/Dockerfile
FROM node:20-alpine

# Install curl for the healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# If you have a build step (e.g., TypeScript), keep this; otherwise it no-ops
RUN npm run build || true

ENV NODE_ENV=production
EXPOSE 3000

# Use your real start script (ensure "start" exists in package.json)
CMD ["npm", "run", "start"]
