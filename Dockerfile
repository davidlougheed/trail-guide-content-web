FROM node:18-bullseye-slim

WORKDIR /tgcw

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --production

COPY . .

RUN npm run build

FROM nginx:1.23

WORKDIR /tgcw

COPY --from=0 /tgcw/dist ./dist
COPY nginx.conf /etc/nginx/nginx.conf
