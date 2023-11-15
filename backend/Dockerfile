FROM node:18-alpine

WORKDIR /backend

COPY . .

RUN npm i

RUN npm run build

RUN chmod +x script.sh

CMD ["sh","script.sh" ]