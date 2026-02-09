# Dockerfile for VirexBooks (Next.js + pnpm)
# Builds the app and runs it in production mode

FROM node:18-alpine

WORKDIR /app

# Use development mode for the container (we run `pnpm dev`)
ENV NODE_ENV=development

# Build tools sometimes needed for native deps
RUN apk add --no-cache python3 make g++ bash

# Install pnpm
RUN npm install -g pnpm@8

# Copy lock & manifest first for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies (regular install so devDependencies are present)
RUN pnpm install

# Copy app sources
COPY . .

# Build the Next.js app (kept as requested)
RUN pnpm build

EXPOSE 3000

# Run the dev server instead of `start` (user requested)
CMD ["pnpm", "dev"]
