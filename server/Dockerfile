# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Create upload directory
RUN mkdir -p /app/upload/images

# Expose port
EXPOSE 4000

# Start the application
CMD ["node", "index.js"]
