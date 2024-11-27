FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

RUN npm install --save-dev rollup

COPY . .

RUN npm run build

EXPOSE 80

CMD [ "serve", "-s", "dist", "-p", "80" ]
