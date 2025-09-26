# Use Node.js 20.18.0 LTS
FROM node:20.18.0-alpine

# Install Python and build tools
RUN apk add --no-cache python3 make g++ py3-pip

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN npm install --legacy-peer-deps --no-optional

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 4173

# Start the application
CMD ["npm", "run", "preview"]