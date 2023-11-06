# Use the official Node.js 18.12.0 image as the base image
FROM node:18.12.0

# Install PNPM
RUN npm install -g pnpm

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the app's dependencies using PNPM
RUN pnpm install

# Copy the rest of the app's files to the container
COPY . .

# Expose port 3000 for the app to listen on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:dev"]
