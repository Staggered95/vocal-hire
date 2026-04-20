FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# You mentioned using ES Modules, so make sure your package.json has "type": "module"
EXPOSE 5001
CMD ["npm", "start"]