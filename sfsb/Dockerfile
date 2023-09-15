# Фаза сборки
FROM --platform=linux/amd64 node:18.16.0-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./ .cd
RUN npm run build

# Фаза продакшена
FROM --platform=linux/amd64 nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
