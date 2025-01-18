FROM node:20.16.0-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8900
CMD ["nginx", "-g", "daemon off;"]
