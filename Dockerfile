FROM node:20-alpine AS base
WORKDIR /app

FROM base AS build

RUN apk add --no-cache bash

COPY . .

RUN npm install
RUN npm run astro:build

RUN chmod +x engine/bin/copy-externals.sh
RUN engine/bin/copy-externals.sh

FROM base AS runtime

COPY --from=build /app/dist ./

ENV HOST=0.0.0.0

ENV PORT=8020

EXPOSE 8020

CMD ["node", "./server/entry.mjs"] 