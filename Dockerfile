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
ARG APP_NAME=QHunt App
ARG APP_API_URL=/
ARG APP_SOCKET_URL=/

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/.output ./

ENV NODE_ENV=${NODE_ENV}
ENV APP_NAME=${APP_NAME}
ENV APP_API_URL=${APP_API_URL}
ENV APP_SOCKET_URL=${APP_SOCKET_URL}

EXPOSE ${PORT}

CMD ["pnpm", "start" ]
