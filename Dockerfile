FROM node:slim

RUN yarn global add pm2

WORKDIR /usr/app/
COPY . .
RUN yarn
RUN yarn run build

EXPOSE 5000

CMD ["pm2-docker", "start", "pm2.yml"]
