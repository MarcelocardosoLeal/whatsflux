FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_HOURS_CLOSE_TICKETS_AUTO
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}
ENV REACT_APP_HOURS_CLOSE_TICKETS_AUTO=${REACT_APP_HOURS_CLOSE_TICKETS_AUTO}
RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache jq

COPY --from=build /app/build ./build
COPY package*.json ./
RUN npm install express
COPY server.js ./
COPY add-env-vars.sh ./
RUN chmod +x add-env-vars.sh

EXPOSE 3250

CMD ["sh", "-c", "sh ./add-env-vars.sh && node server.js"]
