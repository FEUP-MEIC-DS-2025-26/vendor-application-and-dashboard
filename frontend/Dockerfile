# Use the monorepo root as build context!
FROM node:25-alpine3.21 AS builder

WORKDIR /app

# Copy monorepo files
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Copy frontend package files
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/

# Install pnpm
RUN npm install -g pnpm

# Install all dependencies (from monorepo root)
RUN pnpm install --no-frozen-lockfile

# Copy all source code (monorepo root)
COPY . .

# Build the frontend app
WORKDIR /app/frontend
RUN pnpm build

# --- Production image ---
FROM nginx:1.25-alpine
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]