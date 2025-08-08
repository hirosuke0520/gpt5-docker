FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
ENV NODE_ENV=development
EXPOSE 8787
CMD ["npm", "run", "dev"]
