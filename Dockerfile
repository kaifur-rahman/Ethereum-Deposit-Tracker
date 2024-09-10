# Step 1: Use a base Node.js image
FROM node:16-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --production

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Set the environment variables (Optional, prefer using docker-compose for these)
# ENV PORT=5000

# Step 7: Expose the port your application will run on
EXPOSE 5000

# Step 8: Start the application
CMD ["npm", "start"]
