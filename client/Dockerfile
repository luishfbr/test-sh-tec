FROM node:22-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

RUN npm install --save-dev rollup

COPY . .

EXPOSE 80

CMD ["npm", "run","dev"]
