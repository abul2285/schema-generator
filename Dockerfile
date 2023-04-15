### Our base image
FROM node:16

#### Create app directory
WORKDIR /app

#### Install app dependencies
COPY package*.json ./
RUN rm -rf node_modules
RUN npm install



#### Bundle app source
COPY . .

ENV REGION=us-east-1
ENV TABLE_NAME=bookmarks
ENV COGNITO_USER_POOL_ID $COGNITO_USER_POOL_ID
ENV COGNITO_APP_CLIENT_ID $COGNITO_APP_CLIENT_ID

#### Configure container
EXPOSE 3000
RUN npm run build && npm ci
CMD [ "npm", "start" ]