FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Railway injects PORT env var; fallback to 5173 for local
CMD sh -c "npm run dev -- --host 0.0.0.0 --port ${PORT:-5173}"
