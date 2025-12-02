FROM node:25-alpine3.21 AS builder

RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=development
ENV CI=true

COPY . .

RUN pnpm install --no-frozen-lockfile

RUN pnpm build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]