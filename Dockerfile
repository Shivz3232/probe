FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

COPY package.json ./

USER node

RUN npm install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 5000

CMD npm run start
