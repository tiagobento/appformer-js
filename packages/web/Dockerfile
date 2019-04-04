FROM node:7.9.0-alpine

# Copy application files
COPY ./dist /usr/src/app
WORKDIR /usr/src/app

# Install Node.js dependencies
ENV NODE_ENV production
RUN yarn install --production --no-progress
CMD [ "yarn", "start" ]
