FROM node:lts-alpine

WORKDIR /usr/src/mixnjuice-api

# copy source code to image
COPY . .

RUN apk add --no-cache dos2unix

RUN apk --no-cache add --virtual builds-deps build-base python

RUN dos2unix ./bin/start.sh && \
  chmod +x ./bin/start.sh

RUN npm install

RUN npm run build

CMD ["./bin/start.sh"]
