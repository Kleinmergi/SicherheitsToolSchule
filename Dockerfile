FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY apps ./apps
COPY tests ./tests
EXPOSE 3000
CMD ["npm","start"]
