FROM node:20-alpine AS base
WORKDIR /app

FROM base AS build

RUN apk add --no-cache bash

COPY . .

RUN npm install
RUN npm run astro:build
RUN npm run engine:postbuild

FROM base AS runtime

COPY --from=build /app/node_modules/react ./node_modules/react
COPY --from=build /app/node_modules/react-dom ./node_modules/react-dom
COPY --from=build /app/node_modules/scheduler ./node_modules/scheduler

COPY --from=build /app/dist ./

ENV HOST=0.0.0.0

ENV PORT=8020

EXPOSE 8020

CMD ["node", "./server/entry.mjs"] 
