# Etapa de build
FROM node:20-alpine AS build-deps
WORKDIR /usr/src/app
COPY package*.json package-lock.json ./
RUN npm install
COPY . .
# Injetar URL do backend durante o build (Webpack minifica e impossibilita substituição em runtime)
ARG REACT_APP_BACKEND_URL=https://homologapi.whatsflux.com.br
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN npm run build

# Etapa final
#FROM node:20-alpine
#WORKDIR /usr/src/app
RUN apk add --no-cache jq
#COPY --from=build-deps /usr/src/app/build ./build
COPY server.js ./
COPY add-env-vars.sh ./
RUN chmod +x add-env-vars.sh
RUN npm install express
EXPOSE 3250
CMD ["sh", "-c", "sh ./add-env-vars.sh && node server.js"]