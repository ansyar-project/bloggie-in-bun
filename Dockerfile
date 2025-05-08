# Use official Node.js base image
FROM oven/bun:slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the app's source code
COPY . .

# Ensure public/uploads directory exists
RUN mkdir -p public/uploads

# Expose port (match the one used in app.js/index.js)
EXPOSE 3000

# Start the app
CMD ["bun", "index.js"]