# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install netcat and openssl for database connection check and prisma
RUN apk add --no-cache netcat-openbsd openssl

# Copy package files and prisma schema
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client and build application
RUN yarn prisma:generate && \
    yarn build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install netcat and openssl for database connection check and prisma
RUN apk add --no-cache netcat-openbsd openssl

# Copy package files and prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/prisma ./prisma

# Install production dependencies
RUN yarn install --frozen-lockfile

# Copy initialization script
COPY init.sh ./
RUN chmod +x init.sh

EXPOSE 3000

# Use init script to start the application
CMD ["./init.sh"]