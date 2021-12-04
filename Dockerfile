FROM nginx:1.21

COPY nginx.conf /etc/nginx/nginx.conf
RUN apt-get update && \
    apt-get install curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash && \
    apt-get install nodejs

RUN mkdir /tgcw
COPY . /tgcw/

WORKDIR /tgcw
RUN npm ci
RUN npm run build
