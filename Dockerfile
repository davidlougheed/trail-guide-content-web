FROM nginx:1.21

COPY nginx.conf /etc/nginx/nginx.conf
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_16.x | bash && \
    apt-get install -y nodejs

RUN mkdir /tgcw
COPY . /tgcw/

WORKDIR /tgcw
RUN npm ci
RUN npm run build
RUN rm -rf ./node_modules && apt-get purge -y nodejs
