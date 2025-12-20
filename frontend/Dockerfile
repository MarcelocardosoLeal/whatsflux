FROM node:20-alpine AS build-deps
WORKDIR /usr/src/app
COPY package*.json package-lock.json ./
RUN npm install
COPY . .
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_HOURS_CLOSE_TICKETS_AUTO
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
ENV REACT_APP_HOURS_CLOSE_TICKETS_AUTO=${REACT_APP_HOURS_CLOSE_TICKETS_AUTO}
RUN npm run build

RUN apk add --no-cache jq
COPY server.js ./
COPY add-env-vars.sh ./
RUN chmod +x add-env-vars.sh
RUN npm install express
EXPOSE 3250
CMD ["sh", "-c", "sh ./add-env-vars.sh && node server.js"]
