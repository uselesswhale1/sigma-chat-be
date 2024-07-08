FROM node:18.10.0

WORKDIR /dist
 
COPY package.json package.json
COPY package-lock.json package-lock.json
 
RUN npm install
 
COPY . .

EXPOSE 3000 3001
 
CMD npm start