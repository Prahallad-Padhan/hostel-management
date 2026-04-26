FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install sqlite3 --build-from-source

COPY . .

EXPOSE 5000

CMD ["npm", "start"]