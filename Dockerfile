FROM node:14

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 18545

CMD [ "yarn", "run", "start"]
