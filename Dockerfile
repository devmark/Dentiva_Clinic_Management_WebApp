# STAGE 1: Prepare frontend application
FROM nginx:alpine AS frontend-build

WORKDIR /app

# Copy frontend source files
COPY index.html ./
COPY styles/ ./styles/
COPY src/ ./src/

# STAGE 2: Production Nginx image
FROM nginx:alpine AS production

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy application from build stage
COPY --from=frontend-build /app/index.html /usr/share/nginx/html/
COPY --from=frontend-build /app/styles/ /usr/share/nginx/html/styles/
COPY --from=frontend-build /app/src/ /usr/share/nginx/html/src/

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Container health check
HEALTHCHECK --interval=30s --timeout=5s \
    --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
