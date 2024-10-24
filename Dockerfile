FROM node:20

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3333

CMD ["npm", "start"]
