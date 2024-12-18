FROM node:20-alpine AS base
WORKDIR /app

# Hoist everything up one level so we're not still in dist 
# All Astro dependencies are bundled, except react, react-dom and scheduler
# These are contained in a node_modules folder present in the dist directory
COPY dist ./

ENV HOST=0.0.0.0

ENV PORT=8020

EXPOSE 8020

CMD ["node", "./server/entry.mjs"] 
