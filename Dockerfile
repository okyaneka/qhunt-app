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

ARG NODE_ENV=production
ARG PORT=3000
ARG APP_NAME=QHunt App
ARG APP_API_URL=localhost
ARG APP_SOCKET_URL=localhost

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/pnpm-lock.yaml .
COPY --from=build /usr/src/app/.output ./.output
RUN npm install -g pnpm
RUN pnpm install

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV APP_NAME=${APP_NAME}
ENV APP_API_URL=${APP_API_URL}
ENV APP_SOCKET_URL=${APP_SOCKET_URL}

EXPOSE ${PORT}

CMD ["node", ".output/server/index.mjs" ]
