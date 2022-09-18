FROM node:latest

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./

RUN yarn install

CMD ["yarn", "dev", "--host"]
