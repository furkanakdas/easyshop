FROM node:18-alpine as builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json ./

RUN npm ci --production=false  

RUN npx prisma generate

COPY src ./src

RUN npm run build  

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm ci --production  

COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma

COPY --from=builder /app/build ./build

COPY --from=builder /app/prisma ./prisma

COPY src/kafka/schemas ./build/kafka/schemas

EXPOSE 4003
USER node  
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]