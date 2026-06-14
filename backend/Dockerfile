FROM node:24

ENV NODE_ENV=development
ENV DATABASE_URL=postgresql://placeholder:placeholder@db:5432/placeholder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start:dev"]