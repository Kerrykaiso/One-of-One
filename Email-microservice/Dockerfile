FROM node:22

WORKDIR /email-microservice
COPY package*.json ./ 
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "run", "email"]