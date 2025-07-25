FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Add a health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Command to run the application
CMD ["node", "src/server.js"]
