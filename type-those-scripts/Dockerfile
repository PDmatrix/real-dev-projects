FROM node:10

WORKDIR /code

ADD package.json package-lock.json ./

RUN npm install

COPY . ./

CMD ["npm", "start"]