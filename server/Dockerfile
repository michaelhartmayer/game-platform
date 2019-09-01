FROM node:latest

WORKDIR /usr/app

# ADD package.json yarn.lock ./

ADD . .

RUN yarn

# ADD src .babelrc .env ./

CMD yarn start
