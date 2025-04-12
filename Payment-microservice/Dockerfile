FROM node:22
WORKDIR /Payment-microservice
COPY package*.json ./ 
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "run", "payment"]