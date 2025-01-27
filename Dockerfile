# Stage 1
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

# Stage 2
FROM node:20-alpine

LABEL org.opencontainers.image.source=https://github.com/okyaneka/qhunt-api
LABEL org.opencontainers.image.description="QHunt Api Image"

ARG NODE_ENV=production
ARG PORT=3000

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/.output ./

ENV NODE_ENV=${NODE_ENV}

EXPOSE ${PORT}

CMD ["pnpm", "start" ]
