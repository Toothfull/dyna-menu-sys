# Start the image using Node 18
FROM node:18

# Create a new folder for our node.js project and switch to it
RUN mkdir -p /app/ /app/uploads/
WORKDIR /app/

# Add the required files and directories
COPY ./ /app/

# Install node packages
RUN npm install

EXPOSE 80 9000

# Define Start Command
ENTRYPOINT [ "node" ]
CMD [ "/app/" ]
