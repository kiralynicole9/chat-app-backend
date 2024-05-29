FROM node:18

WORKDIR /app
# COPY ./src ./src
COPY ./package.json /app/package.json

RUN yarn global add nodemon
RUN yarn install

EXPOSE 3000

CMD [ "yarn", "start" ]