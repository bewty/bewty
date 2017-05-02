FROM node:boron

RUN npm install -g webpack

WORKDIR /tmp
COPY package.json /tmp/
RUN npm config set registry http://registry.npmjs.org/ && npm install

WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN cp -a /tmp/node_modules /usr/src/app/


ENV NODE_ENV=production

RUN rm -rf dist/

RUN webpack

EXPOSE 3000
CMD [ "npm", "start" ]

