FROM alpine AS builder
WORKDIR /app
RUN apk add --no-cache --update nodejs yarn
COPY package.json yarn.lock ./
RUN yarn install --production

FROM alpine
WORKDIR /app
RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata
RUN apk add --no-cache --update nodejs yarn
COPY --from=builder /app/node_modules ./node_modules
COPY . .
CMD [ "/bin/sh", "-c" , "yarn start" ]
