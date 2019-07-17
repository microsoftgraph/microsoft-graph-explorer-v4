FROM node:12.2.0-alpine


WORKDIR /microsoft-graph-explorer


ENV PATH /microsoft-graph-explorer/node_modules/.bin:$PATH

COPY package.json /microsoft-graph-explorer/package.json
RUN npm install --silent

# start app
CMD ["npm", "start"]
