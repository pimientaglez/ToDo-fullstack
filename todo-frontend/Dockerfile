# Multi-stage build for optimized production image
# Stage 1: Build the application

# Use Node.js 20 on Alpine Linux as the base image for building
# Alpine is chosen for its small size (~5MB vs ~100MB for full Node images)
FROM node:20-alpine AS builder

# Set the working directory inside the container to /app
# All subsequent commands will be run from this directory
WORKDIR /app

# Copy package.json and package-lock.json (if it exists) to the working directory
# These files contain the list of dependencies needed for the project
# We copy these first to take advantage of Docker's layer caching
# If dependencies haven't changed, Docker will use cached layers for npm install
COPY package*.json ./

# Install all dependencies (including devDependencies) needed for building
# --frozen-lockfile ensures the exact versions from package-lock.json are used
# This makes builds reproducible and prevents unexpected version changes
RUN npm ci

# Copy all source code and configuration files to the working directory
# This includes src/, public/, index.html, vite.config.ts, tsconfig.json, etc.
COPY . .

# Build the application for production
# This runs TypeScript compiler (tsc -b) and then Vite build
# The output will be optimized, minified static files in the /app/dist folder
RUN npm run build

# Stage 2: Serve the application with nginx

# Use nginx Alpine as the base image for serving static files
# nginx is a lightweight, high-performance web server perfect for static content
# Alpine version keeps the final image size small (~40MB total)
FROM nginx:alpine

# Copy the built static files from the builder stage to nginx's html directory
# /usr/share/nginx/html is the default location nginx serves files from
# --from=builder references the previous build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a custom nginx configuration file to handle React Router properly
# This ensures that all routes are redirected to index.html for client-side routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80 to allow external access to the web server
# This is the standard HTTP port
EXPOSE 80

# Start nginx in the foreground (daemon off prevents nginx from running in background)
# This is required because Docker containers need a foreground process to stay running
CMD ["nginx", "-g", "daemon off;"]
