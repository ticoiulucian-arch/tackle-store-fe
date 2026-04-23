FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV API_URL=https://tackle-store-backend.onrender.com
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
