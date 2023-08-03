FROM node:14 AS Production

ENV NODE_ENV=production

WORKDIR /var/www/html

COPY package.json .
#COPY package-lock.json .
COPY tailwind.config.js .
COPY postcss.config.js .

RUN npm install

EXPOSE 3000

COPY . .

RUN npm run build

CMD ["sh","-c","npm run start"]