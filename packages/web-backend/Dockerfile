FROM alpine

RUN apk add --update nodejs

# Copy application files
COPY ./dist /usr/submarine/tooling/web-backend
WORKDIR /usr/submarine/tooling/web-backend

# Install Node.js dependencies
ENV NODE_ENV production
CMD [ "node", "index.js" ]
