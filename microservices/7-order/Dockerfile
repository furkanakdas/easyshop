FROM node:18-alpine as builder
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --production=false  

COPY src ./src

RUN npm run build  

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm ci --production  

COPY --from=builder /app/build ./build

COPY src/kafka/schemas ./build/kafka/schemas


EXPOSE 4007
USER node  
CMD ["npm", "run" ,"start"]