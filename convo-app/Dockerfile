FROM node:18.13

# Create app directory
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app
# Copy source code
COPY --chown=node:node . .

# Switch user
USER node

# Update package-lock.json
# RUN npm update
RUN npm cache clean --force

# Install dependencies
RUN npm install

# Expose port
EXPOSE 3000

# Run service
CMD [ "npm", "run", "dev" ]