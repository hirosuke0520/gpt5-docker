FROM node:20-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/* \
  && npm ci || npm install
COPY . .
ENV NODE_ENV=development
EXPOSE 8787
CMD ["npm", "run", "dev"]
