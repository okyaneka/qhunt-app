
# Stage 1
FROM node:20-alpine AS build

ARG PORT=1234
ARG APP_NAME="QHunt App"

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@10.2.0
RUN pnpm install

COPY . .

ENV PORT=${PORT}
ENV APP_NAME=${APP_NAME}

RUN pnpm build

# Stage 2
FROM node:20-alpine

ARG PORT=3000

LABEL org.opencontainers.image.source=https://github.com/okyaneka/qhunt-api
LABEL org.opencontainers.image.description="QHunt App Image"

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/.output ./

EXPOSE ${PORT}

CMD ["node", "server/index.mjs"]
