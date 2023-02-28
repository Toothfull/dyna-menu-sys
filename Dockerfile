# Start the image using Node 18
FROM node:18

# Create a new directory for our project
RUN mkdir -p /app/

# Add the required files and directories
COPY ./ /app/

# Create the uploads directory
RUN mkdir -p /app/Server/uploads

# Switch to the server directory
WORKDIR /app/Server

# Install node packages
RUN npm clean-install --omit=dev

EXPOSE 9000

# Start server
ENTRYPOINT [ "node" ]
CMD [ "." ]
