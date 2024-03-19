FROM node:20-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . .
RUN rm -rf .nx
RUN rm -rf org/.nx

EXPOSE 3333
CMD [ "npm", "run", "start" ]