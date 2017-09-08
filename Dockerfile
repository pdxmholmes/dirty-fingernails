FROM node:8-alpine

RUN apk add --update curl bash && \
    rm -rf /var/cache/apk/*

COPY docker-entrypoint.sh /bin

WORKDIR /var/service

COPY package.json .
ADD dist .
COPY node_modules ./node_modules

ENV NODE_ENV production

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["bot"]
