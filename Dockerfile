FROM node:18-alpine

WORKDIR /app

# curl ve wget ekle (healthcheck için)
RUN apk add --no-cache curl wget

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Healthcheck düzeltildi
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/health || exit 1

CMD ["npm", "start"]
