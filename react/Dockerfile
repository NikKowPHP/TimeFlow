FROM node:alpine as BUILD_IMAGE

WORKDIR /app/frontend

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./
COPY vite.config.js ./

RUN npm install
RUN npm install vite@latest -g 
# RUN npm run build

COPY . ./

ENV PORT=3000
ENV HOST=0.0.0.0

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]