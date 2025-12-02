# Use the monorepo root as build context!
FROM node:25-alpine3.21 AS builder

WORKDIR /app

# Copy only frontend files
COPY package.json pnpm-lock.yaml ./
COPY . .

# Install pnpm
RUN npm install -g pnpm

ENV CI=true

# Install dependencies and build
RUN pnpm install --no-frozen-lockfile
RUN pnpm build

# --- Production image ---
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]