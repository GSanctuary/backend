FROM node:22

WORKDIR /app
COPY package.json /app
COPY ./prisma /app/prisma
RUN yarn install --ignore-peer-dependencies
COPY . /app
CMD ["yarn", "dev:migrate"]