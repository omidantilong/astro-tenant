FROM node:20-alpine AS base
WORKDIR /app

FROM base AS build

RUN apk add --no-cache bash

COPY . .

RUN npm install
RUN npx engine prebuild
RUN npx engine build-astro
RUN npx engine postbuild

# Run the map function once to generate paths
# Eventually this will be done on the fly
RUN npm run engine:map

FROM base AS runtime

# Let tenants control which external deps to copy
COPY --from=build /app/node_modules/react ./node_modules/react
COPY --from=build /app/node_modules/react-dom ./node_modules/react-dom
COPY --from=build /app/node_modules/scheduler ./node_modules/scheduler

# Copy build and engine dirs to root
COPY --from=build /app/dist ./
COPY --from=build /app/engine ./engine

ENV HOST=0.0.0.0
ENV PORT=8020

EXPOSE 8020

CMD ["node", "./server/entry.mjs"] 
