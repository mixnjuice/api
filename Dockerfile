FROM node:12

WORKDIR /usr/src/flavor-api

# copy source code to image
COPY . .

# overwrite config with default
COPY .env.default .env

RUN chmod +x ./bin/start.sh

RUN npm install

RUN npm run build

EXPOSE ${API_PORT:-3000}

CMD ["./bin/start.sh"]
