FROM node:18.3.0

WORKDIR /usr/src
# COPY ./package*.json ./
# RUN npm install
COPY . .
# VOLUME . /usr/src
EXPOSE 5000
# RUN npm run build 
# CMD node ./dist/main
CMD npm run start:dev
