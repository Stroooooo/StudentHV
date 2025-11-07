FROM node:20-alpine AS deps
WORKDIR /app

COPY ./ ./
RUN rm -rf node_modules package-lock.json .next

RUN npm i
RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]