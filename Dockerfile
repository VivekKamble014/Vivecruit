# Step 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Build Next.js app
RUN npm run build

# Step 2: Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# removed next.config.js copy (only needed if your project has it)

# Expose Next.js default port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
