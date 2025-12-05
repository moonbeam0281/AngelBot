# ---- Build stage ----
FROM node:20 AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- Runtime stage (nginx) ----
FROM nginx:alpine
# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built Vite app
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: add a very basic health check page or nginx conf later

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
