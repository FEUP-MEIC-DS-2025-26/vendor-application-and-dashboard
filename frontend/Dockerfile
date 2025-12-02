# mips_example_page/Dockerfile
FROM node:25-alpine3.21 AS builder

# Install pnpm
RUN npm install -g pnpm

# Set workdir
WORKDIR /app

# Copy pnpm files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the app
RUN pnpm build

# --- Production image ---
FROM nginx:1.25-alpine

# Copy built app to nginx html dir
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]