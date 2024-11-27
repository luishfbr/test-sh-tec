FROM node:latest

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY src ./src/
COPY start.sh ./start.sh

RUN npm install

# Torna o script executável
RUN chmod +x start.sh

EXPOSE 8080

# Executa o script de inicialização
CMD ["./start.sh"]
