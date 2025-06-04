FROM node:22

WORKDIR /app
COPY package.json /app
COPY ./prisma /app/prisma
RUN npm install --legacy-peer-deps
COPY . /app
CMD ["npm","run", "dev:migrate"]