FROM node:22

WORKDIR /app
COPY package.json /app
RUN yarn install --ignore-peer-dependencies
COPY . /app
CMD ["npm","run", "dev:migrate"]