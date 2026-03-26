FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ bash

RUN npm install -g pnpm@8

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["pnpm", "start"]
