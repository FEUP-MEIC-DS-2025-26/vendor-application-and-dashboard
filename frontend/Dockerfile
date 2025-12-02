# Use the monorepo root as build context!
FROM node:25-alpine3.21 AS builder

WORKDIR /app

# Copy only frontend files
COPY package.json pnpm-lock.yaml ./
COPY . .

# Install pnpm
RUN npm install -g pnpm
# Install static server used in CMD
RUN npm install -g serve

ENV CI=true

# Install dependencies and build
RUN pnpm install --no-frozen-lockfile
RUN pnpm build
RUN cp -f dist/main.html || true

CMD ["serve", "-s", "dist", "-l", "80", "--single", "--cors"]