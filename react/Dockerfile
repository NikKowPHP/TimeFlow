FROM node:alpine as BUILD_IMAGE

WORKDIR /app/frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH


COPY package*.json ./


RUN npm install
RUN npm install vite@latest -g 
# RUN npm run build

COPY . ./

# CMD [ "npm", "run","dev" ]
RUN npm run build

FROM node:alpine as PRODUCTION_IMAGE
WORKDIR /app/frontend

COPY --from=BUILD_IMAGE /app/frontend/dist /app/frontend/dist
COPY --from=BUILD_IMAGE /app/frontend/node_modules /app/frontend/node_modules

EXPOSE 8080

COPY package.json .
COPY vite.config.js .

EXPOSE 8080
CMD [ "npm", "run", "preview" ]
