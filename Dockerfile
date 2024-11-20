FROM --platform=linux/amd64 node:20-alpine

RUN apk update

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

RUN apk add --no-cache openssl

RUN npm ci

RUN npx prisma generate

COPY . ./

RUN npm run build

CMD npm run "$(if [ "$NODE_ENV" = "development" ] ; then echo "dev" ; else echo "start" ; fi)"