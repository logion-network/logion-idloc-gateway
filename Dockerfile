# Build image
FROM node:16 AS build

WORKDIR /tmp/logion-idloc-gatewat

COPY . .
RUN yarn install --immutable
RUN yarn build

# Deployment image
FROM jonasal/nginx-certbot:3
COPY --from=build /tmp/logion-idloc-gatewat/build /usr/share/nginx/html

CMD [ "/scripts/start_nginx_certbot.sh" ]
