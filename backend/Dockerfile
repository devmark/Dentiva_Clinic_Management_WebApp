# STAGE 1: Install Dependencies

FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev


# STAGE 2: Prepare Application

FROM node:20-alpine AS build

WORKDIR /app

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source code
COPY --chown=node:node src/ ./src/

# Copy package.json
COPY --chown=node:node package*.json ./


# STAGE 3: Production Runtime

FROM node:20-alpine AS production

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000

# Copy application from build stage
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/src ./src
COPY --from=build --chown=node:node /app/package*.json ./

# Run as non-root user
USER node

# Expose backend port
EXPOSE 5000

# Backend health check
HEALTHCHECK --interval=30s --timeout=5s \
    --start-period=15s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:5000/api/health').then(r => {if (!r.ok) process.exit(1)}).catch(() => process.exit(1))"

# Start backend server
CMD ["node", "src/server.js"]
