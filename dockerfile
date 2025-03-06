FROM node:alpine AS node-builder
WORKDIR /usr/src/app
COPY package.json .
RUN npm install

COPY ./ ./
RUN npm run build

FROM nginx
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY /nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=node-builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



