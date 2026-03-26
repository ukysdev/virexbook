FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache python3 make g++ bash

RUN npm install -g pnpm@8

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
