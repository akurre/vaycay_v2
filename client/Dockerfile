# Stage 1: Build the React app
FROM node:18 as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./

# Build with production GraphQL URL
ARG REACT_APP_GRAPHQL_URL
ENV REACT_APP_GRAPHQL_URL=$REACT_APP_GRAPHQL_URL

RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
