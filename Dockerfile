FROM node:22

# Install git
RUN apt-get update && apt-get install -y git

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npm","run", "dev"]