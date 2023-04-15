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
ENV DATABASE_URL=postgresql://postgres:12341234@production-db-1.clwprh5z7wtu.us-east-1.rds.amazonaws.com:5432/postgres
ENV NEXTAUTH_SECRET=8vv3RPG/STJ3nadSLRUKq5LvF2LiYk/kSqf7bYkVpGc=
ENV NEXTAUTH_URL=http://localhost:3000
ENV GOOGLE_CLIENT_ID=158575762814-7ch9uca7i9oqivapf03jkrcj0kpgtlcd.apps.googleusercontent.com
ENV GOOGLE_CLIENT_SECRET=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

#### Configure container
EXPOSE 3000
RUN npm run build && npm ci
CMD [ "npm", "start" ]