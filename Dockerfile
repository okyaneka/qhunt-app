ARG NODE_ENV=production
ARG PORT=3000
ARG APP_NAME=
ARG APP_API_URL=
ARG APP_SOCKET_URL=
ARG PLATFORM=linux/amd64

FROM --platform=${PLATFORM} node:20-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

RUN pnpm build

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}
ENV APP_NAME=${APP_NAME}
ENV APP_API_URL=${APP_API_URL}
ENV APP_SOCKET_URL=${APP_SOCKET_URL}

EXPOSE ${PORT}

CMD ["node", ".output/server/index.mjs" ]
