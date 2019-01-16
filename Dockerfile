FROM node:10

RUN mkdir -p /home/node/kaboom.services.events/node_modules && chown -R node:node /home/node/kaboom.services.events

WORKDIR /home/node/kaboom.services.events

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --chown=node:node . .

USER node

EXPOSE 8600

ENV NODE_IP=0.0.0.0
ENV NODE_PORT=8600

CMD [ "node", "app.js" ]